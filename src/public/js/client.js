// import io from "socket.io";
import io from "socket.io-client";
import {
  setAnswer,
  setOffer,
  setPeerConnection,
} from "../../redux/room/action";
import store from "../../redux/store";

function client(roomNameParameter, myPeerConnectionParameter) {
  const socket = io("http://localhost:8080", {
    widthCredentials: true,
  });
  let roomName = roomNameParameter;
  let myPeerConnection = myPeerConnectionParameter;

  console.log(store.getState());
  socket.emit("join_room", roomName);

  // Socket cdoe
  console.log(`roomName : ${roomName}`);
  console.log(`myPeerConnection : ${myPeerConnection}`);
  // on("welcome")은 peerA측에서 돌아가는 코드
  socket.on("welcome", async () => {
    // 방에 누군가 접속했을 때 offer를 생성한다.
    // 생성된 offer에는 sdp라는 다른 브라우저가 참가할 수 있는 초대장?이 있다.
    const offer = await myPeerConnection.createOffer();
    store.dispatch(setOffer(offer));
    // offer를 가지고나면 이 offer로 연결을 구성해야한다.
    myPeerConnection.setLocalDescription(offer);
    store.dispatch(setPeerConnection(myPeerConnection));

    /* peerA가 방장이라면 peerB가 접속했을 때 peerA가 offer를 생성하고
      setLocalDescription하고 이 offer를 peerB로 보낸다.
    */
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
    // 비디오와 오디오를 전달하는데에는 서버가 필요업지만 offer를 주고받기 위해서는 서버가 필요하다.
  });

  // on("offer")는 peerB측에서 돌아가는 코드
  socket.on("offer", async (offer) => {
    console.log("received the offer");
    // 전달 받은 offer로 remoteDescription 설정
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    // answer를 setLocal하고
    myPeerConnection.setLocalDescription(answer);
    store.dispatch(setPeerConnection(myPeerConnection));
    store.dispatch(setAnswer(answer));
    // offer에 대한 답을 answer로 해야하므로
    socket.emit("answer", answer, roomName);
    console.log("sent the answer");
  });

  // on("answer")는 peerA측에서 돌아가는 코드
  socket.on("answer", (answer) => {
    myPeerConnection.setRemoteDescription(answer);
    store.dispatch(setPeerConnection(myPeerConnection));
    console.log("received the answer");
  });

  socket.on("ice", async (ice) => {
    /* TypeError: Failed to execute 'addIceCandidate' on 'RTCPeerConnection':
 Candidate missing values for both sdpMid and sdpMLineIndex */
    if (ice) {
      //위 에러를 해결하기 위함
      await myPeerConnection.addIceCandidate(ice);
    }
    store.dispatch(setPeerConnection(myPeerConnection));
    console.log("received candidate");
  });

  const handleIce = (data) => {
    // candidate는 브라우저가 소통하는 방법을 알려주는것
    // peerA와 peerB가 icecandidate 이벤트로 생성한 candidate들을 서로 주고 받음
    socket.emit("ice", data.candidate, roomName);
    console.log("sent candidate");
  };

  function handleAddStream(data) {
    const peersVideoRef = document.querySelector(".peersFace");
    peersVideoRef.srcObject = data.stream;
  }

  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);
  store.dispatch(setPeerConnection(myPeerConnection));
}

export default client;
