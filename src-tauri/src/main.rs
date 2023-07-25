// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use util::{check_main_password_is_exist, save_main_password, check_main_password, get_password_names, get_password, save_password};

mod util;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      check_main_exist,
      save_main,
      check_main,
      get_list,
      get_selected_password,
      add_password,
      modify_selected_password,
      delete_selected_password
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
  get_password_names()
}

#[tauri::command]
async fn get_selected_password(name: String, password: String) -> String {
  get_password(name, password)
}

#[tauri::command]
async fn add_password(name: String, password: String) {
  save_password(name, password)
}

#[tauri::command]
async fn modify_selected_password(name: String, password: String) {
  modify_password(name, password)
}

#[tauri::command]
async fn delete_selected_password(name: String) {
  delete_password(name)
}
