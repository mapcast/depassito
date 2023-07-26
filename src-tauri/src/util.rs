use rocksdb::{DB, WriteOptions};
use magic_crypt::{new_magic_crypt, MagicCryptTrait, MagicCryptError};

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

pub fn get_password_names() -> Vec<String> {
    let mut result: Vec<String> = Vec::new();
    let db = DB::open_default("/PwdManager/saved").unwrap();


    let mut iter = db.raw_iterator();
    iter.seek_to_first();
    while iter.valid() {
        let key = String::from_utf8_lossy(&iter.key().to_owned().unwrap()).into_owned();
        if key.ne("master") {
            result.push(key);
        }
        
        iter.next();
    }
    result
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
    let non_encrypted = generate_password();
    println!("non-encrypted value: {}", non_encrypted);
    let encrypted_password = crypt.encrypt_str_to_base64(non_encrypted);
    println!("encrypted value: {}", encrypted_password);

    let db = DB::open_default("/PwdManager/saved").unwrap();
    db.put(name, encrypted_password);
    
}

pub fn get_password(name: String, password: String) -> String {
    let mut key = String::from("");
    for bit in name.clone().as_bytes().iter().rev() {
        key.push_str(&bit.to_string());
    }
    for bit in password.clone().as_bytes().iter().rev() {
        key.push_str(&bit.to_string());
    }

    let db = DB::open_default("/PwdManager/saved").unwrap();
    match db.get(name.clone()) {
        Ok(data) => {
            match data {
                Some(u8vec) => {
                    let selected_password = String::from_utf8_lossy(&u8vec);
                    let crypt = new_magic_crypt!(key, 256);
                    let decrypted = crypt.decrypt_base64_to_string(selected_password);
                    match decrypted {
                        Ok(decrypted) => decrypted,
                        Err(e) => format!("ERROR: {}", e.to_string())
                    } 
                },
                None => format!("ERROR: has no key {}", name)
            }
        }
        Err(e) => format!("ERROR: {}", e.to_string())
    }
}

pub fn delete_password(name: String) {
    let db = DB::open_default("/PwdManager/saved").unwrap();
    db.delete(name);
}

fn generate_password() -> String {
    let upper_case_chars: [char; 26] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let lower_case_chars: [char; 26] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let digit_chars: [char; 10] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let special_chars: [char; 6] = ['!', '@', '#', '$', '%', '^', '(', ')', '.', ',', '?', ':', ';'];

    let mut password: Vec<char> = Vec::new();
    let upper_case_length = rand::thread_rng().gen_range(4..6);
    let lower_case_length = rand::thread_rng().gen_range(4..6);
    let digit_length = rand::thread_rng().gen_range(3..5);
    let special_length = rand::thread_rng().gen_range(3..5);
    for _ in 1..upper_case_length {
        password.push(upper_case_chars.choose(&mut rand::thread_rng()));
    }
    for _ in 1..lower_case_chars {
        password.push(lower_case_chars.choose(&mut rand::thread_rng()));
    }
    for _ in 1..digit_length {
        password.push(digit_chars.choose(&mut rand::thread_rng()));
    }
    for _ in 1..special_length {
        password.push(special_chars.choose(&mut rand::thread_rng()));
    }
    password.shuffle(&mut rand::thread_rng());
    password.iter().collect()
}
