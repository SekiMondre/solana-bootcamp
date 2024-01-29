use borsh::BorshSerialize;
use solana_program::{
    account_info::{next_account_info, AccountInfo}, entrypoint, entrypoint::ProgramResult, msg, program::invoke_signed, program_error::ProgramError, pubkey::Pubkey, rent::Rent, system_instruction, sysvar::Sysvar
};
pub mod instruction;
use instruction::MovieInstruction;
pub mod state;
use state::MovieAccountState;

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {

    let instruction = MovieInstruction::unpack(instruction_data)?;

    match instruction {
        MovieInstruction::Add { title, rating, description } => {
            add_movie_review(program_id, accounts, title, rating, description)
        }
    }
}

pub fn add_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    rating: u8,
    description: String
) -> ProgramResult {

    let account_info_iter = &mut accounts.iter();

    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let (pda, bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), title.as_bytes().as_ref()], program_id);

    let account_len: usize = 1 + 1 + (4 + title.len()) + (4 + description.len());

    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);

    invoke_signed(&system_instruction::create_account(
            initializer.key, 
            pda_account.key, 
            rent_lamports, 
            account_len.try_into().unwrap(), 
            program_id
        ), 
        &[initializer.clone(), pda_account.clone(), system_program.clone()], 
        &[&[initializer.key.as_ref(), title.as_bytes().as_ref(), &[bump_seed]]],
    )?;

    msg!("PDA created: {}", pda);

    let mut account_data = try_from_slice_unchecked2::<MovieAccountState>(&pda_account.data.borrow()).unwrap();

    account_data.title = title;
    account_data.rating = rating;
    account_data.description = description;
    account_data.is_initialized = true;

    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    msg!("serialized data");
    // msg!("Add item...");
    // msg!("Title: {}", title);
    // msg!("Rating: {}", rating);
    // msg!("Description: {}", description);

    Ok(())
}

// workaround for compile error
fn try_from_slice_unchecked2<T: borsh::BorshDeserialize>(data: &[u8]) -> Result<T, ProgramError> {
    let mut data_mut = data;
    match T::deserialize(&mut data_mut) {
        Ok(result) => Ok(result),
        Err(_) => Err(ProgramError::InvalidInstructionData)
    }
}