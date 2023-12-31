import { useAppDispatch } from '@/redux';
import { deletePassword } from '@/redux/listSlice';
import { invoke } from '@tauri-apps/api/tauri';
import { useRef, useState } from 'react';

export default function DeleteConfirmModal({selectedName, setOnOff}: {selectedName: string, setOnOff: Function}) {

    const dispatch = useAppDispatch();

    const overlay = useRef(null);
    const modal = useRef(null);
    const xbutton = useRef(null);
    const handleOverlayClick = (event: any) => {
        if(event.target === overlay.current || event.target === modal.current || event.target === xbutton.current) {
            setOnOff(false);
        } 
    }

    const handleOClick = () => {
        invoke('delete_selected_password', { selectedName }).then(() => {
            dispatch(deletePassword(selectedName));
            setOnOff(false);
        }).catch(error => {
            console.log('rust와의 통신에 실패했습니다...' + error);
        });
    }

    return (
        <>
            <div ref={overlay} onClick={handleOverlayClick} className="modal-overlay">
                <div ref={modal} className="delete-confirm-modal">
                    <h4>데이터를 정말 삭제하시겠습니까?</h4>
                    <div className="button-container">
                        <button onClick={handleOClick} className="button-confirm">O</button>
                        <button ref={xbutton} className="button-cancel">X</button>
                    </div>
                </div>
            </div>
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

                .delete-confirm-modal {
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
