import { useAppDispatch } from "@/redux";
import { addPassword } from "@/redux/listSlice";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useRef, useState } from "react"

export default function AddModal({mainPassword, setOnOff}: {mainPassword: string, setOnOff: Function}) {
    const [name, setName] = useState('');
    const dispatch = useAppDispatch();
    const handleInputChange = (event: any) => {
        setName(event.target.value);
    }

    const onAddPassword = () => {
        invoke('put_password', { name, mainPassword }).then(() => {
            dispatch(addPassword(name));
            setName('');
            setOnOff(false);
        }).catch(error => {
            console.log('rust와의 통신에 실패했습니다...' + error);
        });
    }
    
    const overlay = useRef(null);
    const modal = useRef(null);
    const handleOverlayClick = (event: any) => {
        if(event.target === overlay.current) {
            setName('');
            setOnOff(false);
        } else if(event.target === modal.current) {
            setName('');
            setOnOff(false);
        }
    }

    return (
        <>
            <div ref={overlay} onClick={handleOverlayClick} className="modal-overlay">
                <div ref={modal} className="modal">
                    <h4>추가할 패스워드의 제목을 입력해주세요.</h4>
                    
                    <div className="input-wrap">
                        <input type="text" value={name} onChange={handleInputChange}></input>
                        <button onClick={() => onAddPassword()}>추가</button>
                    </div>
                </div>
            </div>
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
