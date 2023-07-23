use rocksdb::{DB, WriteOptions};
use magic_crypt::{new_magic_crypt, MagicCryptTrait, MagicCryptError};
use uuid::Uuid;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync + 'static>>;

pub fn save_main_password(password: String) {
    let mut key = String::from("");
    for bit in password.clone().as_bytes() {
        key.push_str(&bit.to_string());
    }

    let crypt = new_magic_crypt!(key, 256);
    let non_encrypted = Uuid::new_v4().to_string();
    println!("non-encrypted value: {}", non_encrypted);
    let encrypted_password = crypt.encrypt_str_to_base64(non_encrypted);
    println!("encrypted value: {}", encrypted_password);
}

pub fn check_main_password(password: String) {
    let mut key = String::from("");
    for bit in password.clone().as_bytes().iter().rev() {
        key.push_str(&bit.to_string());
    }

    let crypt = new_magic_crypt!(key, 256);
    let decrypted = crypt.decrypt_base64_to_string(""); // db에서 꺼낸 string
    match decrypted {
        Ok(decrypted) => println!("decrypted value: {}", decrypted),
        _ => println!("decrypt error has occured. you bad hacker.")
    }
}

pub fn save_password(name: String, password: String) {
    let mut key = String::from("");
    for bit in name.clone().as_bytes().iter().rev() {
        key.push_str(&bit.to_string());
    }
    for bit in password.clone().as_bytes().iter().rev() {
        key.push_str(&bit.to_string());
    }

    let crypt = new_magic_crypt!(key, 256);
    let non_encrypted = Uuid::new_v4().to_string();
    println!("non-encrypted value: {}", non_encrypted);
    let encrypted_password = crypt.encrypt_str_to_base64(non_encrypted);
    println!("encrypted value: {}", encrypted_password);

    let db = DB::open_default("/PwdManager/saved").unwrap();
    db.put(name, encrypted_password);
    
}

pub fn get_password(name: String, password: String, encrypted: String) {
    let mut key = String::from("");
    for bit in name.clone().as_bytes().iter().rev() {
        key.push_str(&bit.to_string());
    }
    for bit in password.clone().as_bytes().iter().rev() {
        key.push_str(&bit.to_string());
    }

    let crypt = new_magic_crypt!(key, 256);
    let decrypted = crypt.decrypt_base64_to_string(encrypted);
    match decrypted {
        Ok(decrypted) => println!("decrypted value: {}", decrypted),
        _ => println!("decrypt error has occured. you bad hacker.")
    }
}