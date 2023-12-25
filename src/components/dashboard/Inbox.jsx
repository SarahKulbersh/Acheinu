import {useState} from "react";
import {messageStartIcon} from "../../assets";

const messags = [
    {name: "John Doe", payable: "Accounts Payable", message: "Hi, reaching to you", time: "3.12 PM", readCount: 1},
    {name: "John Doe", payable: "Accounts Payable", message: "Hi, reaching to you", time: "3.12 PM", readCount: 0},
    {name: "John Doe", payable: "Accounts Payable", message: "Hi, reaching to you", time: "3.12 PM", readCount: 0},
    {name: "John Doe", payable: "Accounts Payable", message: "Hi, reaching to you", time: "3.12 PM", readCount: 0},
]

export const Inbox = () => {

    const [clicked, setClicked] = useState(false);

    return (
        <div className="messages_inbox">
            <div className='message_left'>
            <h2 className="job_dashboard_title">Messages</h2>
                <div className='read_unread_box'>
                    <button className={"signin " + (!clicked ? "read_clicked " : "read_unread ")}
                            onClick={() => setClicked(true)}>Inbox
                    </button>
                    <button className={"signin " + (clicked ? "read_clicked " : "read_unread ")}
                            onClick={() => setClicked(false)}>Unread
                    </button>
                </div>
                <div className="messages_boxes">
                    {
                        messags.map((e, i) => (
                            <div className='messages_box' key={i}>
                                <div className="message_title">
                                    <div>{e.name}</div>
                                    <div>{e.time}</div>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        <div className="message_desc">{e.payable}</div>
                                        <div className="message_desc">{e.message}</div>
                                    </div>
                                    {!!e.readCount && <div className='read_count'>{e.readCount}</div>}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='message_right'>
                <img src={messageStartIcon} alt=""/>
                <h2>Welcome to Message</h2>
                <p>When you contact a candidate, it will appear here</p>
            </div>
        </div>
    )
}