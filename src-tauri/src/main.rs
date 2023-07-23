// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod util;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      save_main_password
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn save_main_password() {

}

#[tauri::command]
async fn get_password_list() -> Vec<String> {
  Vec::new()
}

#[tauri::command]
async fn get_password() -> String {
  "".into()
}

#[tauri::command]
async fn save_password() {
  
}