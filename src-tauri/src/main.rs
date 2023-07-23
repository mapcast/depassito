// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use util::{check_main_password_is_exist, save_main_password, check_main_password};

mod util;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      check_main_exist,
      save_main,
      check_main,
      get_list,
      get_password,
      save_password
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn check_main_exist() -> bool {
  check_main_password_is_exist()
}

#[tauri::command]
async fn save_main(password: String) {
  save_main_password(password);
}

#[tauri::command]
async fn check_main(password: String) -> bool {
  check_main_password(password)
}

#[tauri::command]
async fn get_list() -> Vec<String> {
  Vec::new()
}

#[tauri::command]
async fn get_password() -> String {
  "".into()
}

#[tauri::command]
async fn save_password() {
  
}