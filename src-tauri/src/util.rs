use rocksdb::{DB, WriteOptions};
use magic_crypt::{new_magic_crypt, MagicCryptTrait, MagicCryptError};
use uuid::Uuid;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync + 'static>>;

pub fn check_main_password_is_exist() -> bool {
    let db = DB::open_default("/PwdManager/saved").unwrap();
    match db.get("master") {
        Ok(data) => {
            match data {
                Some(_) => true,
                None => false 
            }
        },
        Err(_) => false
    }
}

pub fn save_main_password(password: String) {
    let mut key = String::from("");
    for bit in password.clone().as_bytes() {
        key.push_str(&bit.to_string());
    }

    let crypt = new_magic_crypt!(key, 256);
    println!("non-encrypted value: {}", password);
    let encrypted_password = crypt.encrypt_str_to_base64(password);
    println!("encrypted value: {}", encrypted_password);

    let db = DB::open_default("/PwdManager/saved").unwrap();
    db.put("master", encrypted_password);
}

pub fn check_main_password(password: String) -> bool {
    let mut key = String::from("");
    for bit in password.clone().as_bytes() {
        key.push_str(&bit.to_string());
    }

    let db = DB::open_default("/PwdManager/saved").unwrap();
    match db.get("master") {
        Ok(data) => {
            match data {
                Some(u8vec) => {
                    let master_password = String::from_utf8_lossy(&u8vec);
                    let crypt = new_magic_crypt!(key, 256);
                    let decrypted = crypt.decrypt_base64_to_string(master_password); // db에서 꺼낸 string
                    match decrypted {
                        Ok(decrypted) => {
                            if decrypted.eq(&password) {
                                true
                            } else {
                                println!("auth failed");
                                println!("decrypted: {}", decrypted);
                                println!("password: {}", password);
                                false
                            }
                        },
                        Err(e) => false
                    } 
                },
                None => false
            }
        }
        Err(_) => false
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