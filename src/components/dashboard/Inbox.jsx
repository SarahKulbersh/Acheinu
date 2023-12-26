import {useState} from "react";
import {attachmentIcon, messageStartIcon} from "../../assets";

const messages = [
    {
        name: "John Doe",
        payable: "Accounts Payable",
        message: "Hi, reaching to you",
        time: "3.12 PM",
        readCount: 1,
        description: "Hi Jobby, a good fit for the position. Would lova good fit for the position. Would lov Thank you for applying Home Delivery Driver at Wayfair. Your wor",
        date: new Date(),
        from: "Customer Service Representative",
    },
    {
        name: "John Doe",
        payable: "Accounts Payable",
        message: "Hi, reaching to you",
        time: "3.12 PM",
        readCount: 0,
        description: "Thank you for applying Home Delivery Driver at Wayfair. Your work experience seem like a good fit for the position. Would love to talk more with you about the position. Do you have time next week? Looking forward to it.",
        date: new Date(),
        from: "Customer Service Representative",
    },
    {
        name: "John Doe",
        payable: "Accounts Payable",
        message: "Hi, reaching to you",
        time: "3.12 PM",
        readCount: 0,
        description: "Hi Jobby,Thank you for applying Home Delivery Driver at Wayfair. Your work experience seem like a good fit for the position. Would love to talk more with you about the position. Do you have time next week? Looking forward to it.",
        date: new Date(),
        from: "Customer Service Representative",
    },
    {
        name: "John Doe",
        payable: "Accounts Payable",
        message: "Hi, reaching to you",
        time: "3.12 PM",
        readCount: 0,
        description: "Hi Jobby,Thank you for applying Home Delivery Driver at Wayfair. Your work experience seem like a good fit for the position. Would love to talk more with you about the position. Do you have time next week? Looking forward to it.",
        date: new Date(),
        from: "Customer Service Representative",
    },
]

export const Inbox = () => {

    const [clicked, setClicked] = useState(false);
    const [activeIndex, setIndex] = useState(-1);
    return (
        <div className="messages_inbox">
            <div className='message_left'>
                <h2 className="job_dashboard_title">Messages</h2>
                <div className='message_left_box'>
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
                            messages.map((e, i) => (
                                <div className='messages_box' key={i} onClick={() => setIndex(i)}
                                     style={{border: `1px solid ${activeIndex !== i ? "var(--Text-Color-15, #DADDE0)" : "var(--Primary-Color-100, #2557A7)"}`}}>
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
            </div>
            <div className='message_right' style={{alignItems: activeIndex!==-1?"start":"center"}}>
                {(() => {
                    if (activeIndex === -1)
                        return (<>
                            <img src={messageStartIcon} alt=""/>
                            <h2>Welcome to Message</h2>
                            <div className='message_right_desc'>When you contact a candidate, it will appear here</div>
                        </>)
                    const message = messages[activeIndex];
                    const currentDate = message.date;
                    return <>
                        <div className='message_from'>{message.from}</div>
                        <div className='message_date'>You applied to this position
                            on{currentDate.getDate() + ', ' + currentDate.getFullYear()}</div>
                        <div className="message_day">{["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][currentDate.getDay()]}</div>
                        <div className='message_name'>Ilias Miah</div>
                        <div className='message_desc'>{message.description}</div>
                        <div className='message_box_reply'>
                            <textarea className='message_box_reply_input' placeholder='Write Your Message' />
                            <div>
                            <img className='message_box_reply_img' src={attachmentIcon} alt='' />
                                <button disabled className='message_box_send'>Send</button>
                            </div>
                        </div>
                    </>
                })()}
            </div>
        </div>
    )
}