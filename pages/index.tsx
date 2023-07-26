import AddModal from "@/components/addModal";
import DeleteConfirmModal from "@/components/deleteConfirmModal";
import ModifyConfirmModal from "@/components/modifyConfirmModal";
import PasswordModal from "@/components/passwordModal";
import { RootState, useAppDispatch } from "@/redux";
import { useSelector } from 'react-redux';
import classNames from "classnames";
import { Sunflower, Do_Hyeon } from "next/font/google";
import { useEffect, useState } from 'react';
import { invoke } from "@tauri-apps/api/tauri";
import { setList } from "@/redux/listSlice";
import Toast from "@/components/toast";

const sunflower = Sunflower({
    subsets: ["latin"], 
    weight: ["700"],
});

const dohyeon = Do_Hyeon({
    subsets: ["latin"], 
    weight: ["400"],
});

export default function Home() {
    const [selectedName, setSelectedName] = useState('');

    const [addModalOnOff, setAddModalOnOff] = useState(false);
    const [modifyConfirmModalOnOff, setModifyConfirmModalOnOff] = useState(false);
    const [deleteConfirmModalOnOff, setDeleteConfirmModalOnOff] = useState(false);

    const [toastOnOff, setToastOnOff] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [mainExist, setMainExist] = useState(false);

    //redux 데이터
    const { names } = useSelector((state: RootState) => state.list);
    const mainPassword = useSelector((state: RootState) => state.auth.password);

    useEffect(() => {
        invoke('check_main_exist').then((boolValue: any) => {
            setMainExist(boolValue);
        }).catch(error => {
            console.log('rust와의 통신에 실패했습니다...' + error);
        });
    }, []);

    useEffect(() => {
        if(toastOnOff) {
            setTimeout(() => {
                setToastOnOff(false);
            }, 2000);
        }
    }, [toastOnOff]);

    const handleModify = (event: any, name: string) => {
        event.stopPropagation();
        setSelectedName(name);
        setModifyConfirmModalOnOff(true);
    }

    const handleDelete = (event: any, name: string) => {
        event.stopPropagation();
        setSelectedName(name);
        setDeleteConfirmModalOnOff(true);
    }

    const handleGet = (name: string) => {
        let selectedName = name;
        console.log(selectedName);
        invoke('get_selected_password', { selectedName, mainPassword }).then((password: any) => {
            navigator.clipboard.writeText(password);
            setToastMessage('복사 완료');
            setToastOnOff(true);
        }).catch(error => {
            setToastMessage('에러 발생');
        });
    }

    return (
        <>
            <PasswordModal isMainExist={mainExist}/>
            {addModalOnOff && (
                <AddModal mainPassword={mainPassword} setOnOff={setAddModalOnOff}/>
            )}
            {modifyConfirmModalOnOff && (
                <ModifyConfirmModal mainPassword={mainPassword} selectedName={selectedName} setOnOff={setModifyConfirmModalOnOff}/>
            )}
            {deleteConfirmModalOnOff && (
                <DeleteConfirmModal selectedName={selectedName} setOnOff={setDeleteConfirmModalOnOff}/>
            )}
            {toastOnOff && (
                <Toast message={toastMessage}/>
            )}
            <div className="wrap">
                <ul className={sunflower.className}>
                    {names.map((name: string, index: number) => (
                        <li onClick={() => handleGet(name)} key={index}>
                            <p>{name}</p>
                            <div className="flex">
                                <button onClick={(event) => handleModify(event, name)} className={classNames('renewal', dohyeon.className)}>갱신</button>
                                <button onClick={(event) => handleDelete(event, name)} className={classNames('delete', dohyeon.className)}>삭제</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <button onClick={() => setAddModalOnOff(true)} className="fixed-button">+</button>
            </div>
            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                }

                .wrap {
                    background: rgba(17,24,39,0.85);
                    width: 400px;
                    height: 600px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 0;
                }

                .wrap::-webkit-scrollbar {
                    width: 5px;
                }
                .wrap::-webkit-scrollbar-thumb {
                    background: #ddd;
                }
                .wrap::-webkit-scrollbar-track {
                    background: #666;
                }

                li {
                    width: 384px;
                    height: 26px;
                    background: rgba(17,24,39,0.9);
                    border-bottom: 1px solid #001C30;
                    color: rgba(156,163,175,0.9);
                    display: flex;
                    text-align: center;
                    font-size: 18px;
                    justify-content: space-between;
                    padding : 12px 8px;
                    cursor: pointer;
                }

                li:hover {
                    background: rgba(17,24,39,0.8);
                    border-bottom: 1px solid rgba(17,24,39,0.8);
                }

                li > p {
                    margin-top: 4px;
                }

                .flex {
                    display: flex;
                }

                .flex > button {
                    margin-left : 5px;
                }

                .renewal {
                    background-color: #c2fbd7;
                    border-radius: 100px;
                    box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
                    cursor: pointer;
                    color: rgba(0, 0, 0, 0.2);
                    display: inline-block;
                    padding: 4px 10px;
                    text-align: center;
                    text-decoration: none;
                    font-size: 16px;
                    transition: all 250ms;
                    border: 0;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                }

                .renewal:hover {
                    box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
                    transform: scale(1.05) rotate(-1deg);
                }

                .delete {
                    background-color: #ef6262;
                    border-radius: 100px;
                    box-shadow: rgba(180, 62, 62, .2) 0 -25px 18px -14px inset,rgba(180, 62, 62, .2) 0 1px 2px,rgba(180, 62, 62, .2) 0 2px 4px,rgba(180, 62, 62, .2) 0 4px 8px,rgba(180, 62, 62, .2) 0 8px 16px,rgba(180, 62, 62, .2) 0 16px 32px;
                    cursor: pointer;
                    color: rgba(0, 0, 0, 0.2);
                    display: inline-block;
                    padding: 4px 10px;
                    text-align: center;
                    text-decoration: none;
                    font-size: 16px;
                    transition: all 250ms;
                    border: 0;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                }

                .delete:hover {
                    box-shadow: rgba(180, 62, 62, .25) 0 -25px 18px -14px inset,rgba(180, 62, 62, .25) 0 1px 2px,rgba(180, 62, 62, .25) 0 2px 4px,rgba(180, 62, 62, .25) 0 4px 8px,rgba(180, 62, 62, .25) 0 8px 16px,rgba(180, 62, 62, .25) 0 16px 32px;
                    transform: scale(1.05) rotate(-1deg);
                }

                footer {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 60px;
                    background: radial-gradient(circle, #c7ecee, #a4b0bd);
                    border-top: 1px solid #D4E2D4;
                    color: #fff;
                }

                .fixed-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    background-color: #87CEEB;
                    background-image: linear-gradient(45deg, #87CEEB, #007BFF); 
                    color: #FFF;
                    border: 4px solid #FFF;
                    border-radius: 50%;
                    font-size: 40px;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                }
                  
                .fixed-button:hover {
                    background-color: #4682B4; 
                    background-image: linear-gradient(45deg, #4682B4, #0056b3);
                }
            `}</style>
        </>
    )
}
