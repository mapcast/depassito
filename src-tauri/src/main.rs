// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use util::{check_main_password_is_exist, save_main_password, check_main_password, get_password_names, get_password, save_password, delete_password};
use serde::Serialize;
use tauri::api::Result;
mod util;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      check_main_exist,
      save_main,
      check_main,
      get_list,
      get_selected_password,
      put_password,
      delete_selected_password
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[derive(Serialize)]
struct Data {
  names: Vec<String>,
}

#[tauri::command]
async fn check_main_exist() -> bool {
  check_main_password_is_exist()
}

#[tauri::command]
async fn save_main(main_password: String) {
  save_main_password(main_password);
}

#[tauri::command]
async fn check_main(main_password: String) -> bool {
  check_main_password(main_password)
}

#[tauri::command]
async fn get_list() -> Data {
  Data {
    names: get_password_names()
  }
}

#[tauri::command]
async fn get_selected_password(selected_name: String, main_password: String) -> String {
  get_password(selected_name, main_password)
}

#[tauri::command]
async fn put_password(selected_name: String, main_password: String) {
  save_password(selected_name, main_password)
}

#[tauri::command]
async fn delete_selected_password(selected_name: String) {
  delete_password(selected_name)
}
