import {
    DialIcon,
    MuteIcon,
    SpeakerIcon,
    VideoDialIcon,
  } from "../../svg";
  
  export default function CallAcions({ endCall }) {
    return (
      <div className="actions-container">
        {false && <><button className="call-action transparent">
                <SpeakerIcon className="btn_secondary" />
              </button>
              <button className="call-action transparent">
                <VideoDialIcon className="btn_secondary" />
              </button>
              <button className="call-action transparent">
                <MuteIcon className="btn_secondary" />
              </button></>}
              <button onClick={() => endCall()}className="call-action red">
                <DialIcon className="btn_secondary" />
              </button>
      </div>
    );
  }