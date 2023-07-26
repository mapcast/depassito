export default function Toast({message}: {message: string}) {

    return (
        <>
            <div>
                <p>{message}</p>
            </div>
            <style jsx>{`
                div {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(255, 255, 255, 0.9);
                    color: #000;
                    padding: 0 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    z-index: 9999;
                }
                
                p {
                    font-size: 16px;
                    line-height: 1.4;
                }
            `}</style>
        </>
    )
}
