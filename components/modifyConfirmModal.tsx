import { invoke } from '@tauri-apps/api/tauri';
import { useRef, useState } from 'react';

export default function ModifyConfirmModal({mainPassword, selectedName, onOff, setOnOff}: {mainPassword: string, selectedName: string, onOff: boolean, setOnOff: Function}) {
    const overlay = useRef(null);
    const modal = useRef(null);
    const cancel = useRef(null);
    const handleOverlayClick = (event: any) => {
        if(event.target === overlay.current || event.target === modal.current || event.target === cancel.current) {
            setOnOff(false);
        }
    }

    const handleOClick = () => {
        invoke('put_password', { mainPassword, selectedName }).then(() => {
            setOnOff(false);
        }).catch(error => {
            console.log('rust와의 통신에 실패했습니다...' + error);
        });
    }    
    return (
        <>
            {onOff && (
                <div ref={overlay} onClick={handleOverlayClick} className="modal-overlay">
                    <div ref={modal} className="modify-confirm-modal">
                        <h4>패스워드를 갱신하시겠습니까?</h4>
                        <div className="button-container">
                            <button onClick={handleOClick} className="button-confirm">O</button>
                            <button ref={cancel} className="button-cancel">X</button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                h4 {
                    margin-top: 120px;
                    color: white;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999; /* 모달을 가장 위로 올리기 위해 z-index 적용 */
                }

                .modify-confirm-modal {
                    position: relative;
                    width: 400px;
                    height: 400px;
                    background-color: rgba(0, 0, 0, 0);
                    border-radius: 4px;
                    align-items: center;
                    text-align: center;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .button-container {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }
                  
                button {
                    width: 100px;
                    height: 100px;
                    font-size: 50px;
                    font-weight: 800;
                    background-color: rgba(0, 0, 0, 0); 
                    cursor: pointer;
                    border: 0;
                }

                button:hover {
                    font-size: 60px;
                }
                  
                .button-confirm {
                    color: #EF6262;
                    margin-right: 10px;
                }
                  
                .button-cancel {
                    color: #468B97;
                }
            `}</style>
        </>
    )
}
