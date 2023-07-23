import { RootState, useAppDispatch } from "@/redux";
import { setAuthComplete } from "@/redux/authSlice";
import { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';

import { invoke } from '@tauri-apps/api/tauri'

export default function PasswordModal({isMainExist}: {isMainExist: boolean}) {
    const [onOff, setOnOff] = useState(true)
    const [password, setPassword] = useState('');
    

    const dispatch = useAppDispatch();
    const handleInputChange = (event: any) => {
        setPassword(event.target.value);
    }
    const submitAdminPassword = () => {
        if(password.trim() !== '') {
            if(isMainExist) {
                invoke('check_main', { password }).then((boolValue: any) => {
                    if(boolValue) {
                        dispatch(setAuthComplete(password));
                        setOnOff(false);
                    } else {
                        setPassword('');
                    }
                }).catch(error => {
                    alert('rust와의 통신에 실패했습니다...');
                });
            } else {
                invoke('save_main', { password });
                dispatch(setAuthComplete(password));
                setOnOff(false);
            }
        }
    }

    return (
        <>
            {onOff && (
                <div className="modal-overlay">
                    <div className="modal">
                        {isMainExist ? (
                            <h4>패스워드를 입력해주세요.</h4>
                        ) : (
                            <h4>패스워드를 설정해주세요.</h4>
                        )}
                        
                        <div className="input-wrap">
                            <input type="password" value={password} onChange={handleInputChange}></input>
                            <button onClick={submitAdminPassword}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5); /* 투명도 적용 */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999; /* 모달을 가장 위로 올리기 위해 z-index 적용 */
                }

                .modal {
                    text-align: center;
                }

                h4 {
                    color: white;
                    margin-bottom: 50px;
                }

                .input-wrap {
                    position: relative;
                    width: auto;
                    height: 38px;
                    background-color: rgba(0, 0, 0, 0); /* 투명도 적용 */
                    border-radius: 4px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    margin-bottom: 80px;
                }

                input {
                    width: 100%;
                    border: 1px solid #ccc;
                    border-radius: 100px;
                    padding: 10px 100px 10px 20px; 
                    line-height: 1;
                    box-sizing: border-box;
                    outline: none;
                }

                button {
                    position: absolute;
                    right: 3px; 
                    top: 3px;
                    bottom: 3px;
                    border: 0;
                    background: #176B87;
                    color: #fff;
                    outline: none;
                    margin: 0;
                    padding: 0 10px;
                    border-radius: 100px;
                    z-index: 2;
                    cursor: pointer;
                }
                button:hover {
                    background: #001C30;
                }
            `}</style>
        </>
    )
}