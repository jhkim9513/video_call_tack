// import io from "socket.io";
import io from "socket.io-client";
import store from "../../redux/store";

function client(roomName, myPeerConnection) {
  const socket = io("http://localhost:8080");

  console.log(store.getState());
  socket.emit("join_room", roomName);
  // let roomName;
  // let myPeerConnection;

  // roomName = store.getState().roomReducer.roomName;
  // myPeerConnection = store.getState().roomReducer.peerConnection;
  // Socket cdoe
  console.log(`roomName : ${roomName}`);
  console.log(`myPeerConnection : ${myPeerConnection}`);
  // on("welcome")은 peerA측에서 돌아가는 코드
  socket.on("welcome", async () => {
    //video, audio가 아닌 text라면 dataChannel을 이용
    //offer생성자 즉, 방의 첫번째 사람이 dataChannel을 생성해야한다. 이 때 offer생정 전에 만들어야함
    // myDataChannel = myPeerConnection.createDataChannel("chat");
    // // 만들어진 dataChannel에 meesage이벤트를 등록하여 메시지를 받으면(send()) 반응하도록한다.
    // myDataChannel.addEventListener("message", console.log);
    // console.log("data channel 만들었음");

    // 방에 누군가 접속했을 때 offer를 생성한다.
    // 생성된 offer에는 sdp라는 다른 브라우저가 참가할 수 있는 초대장?이 있다.
    const offer = await myPeerConnection.createOffer();
    // offer를 가지고나면 이 offer로 연결을 구성해야한다.
    myPeerConnection.setLocalDescription(offer);

    /* peerA가 방장이라면 peerB가 접속했을 때 peerA가 offer를 생성하고
      setLocalDescription하고 이 offer를 peerB로 보낸다.
    */
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
    // 비디오와 오디오를 전달하는데에는 서버가 필요업지만 offer를 주고받기 위해서는 서버가 필요하다.
  });

  // on("offer")는 peerB측에서 돌아가는 코드
  socket.on("offer", async (offer) => {
    // 새로운 datachannel이 있으면 알림을 받음
    // myPeerConnection.addEventListener("datachannel", (event) => {
    //   myDataChannel = event.channel;
    //   myDataChannel.addEventListener("message", console.log);
    // });

    console.log("received the offer");
    // 전달 받은 offer로 remoteDescription 설정
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    // answer를 setLocal하고
    myPeerConnection.setLocalDescription(answer);
    // offer에 대한 답을 answer로 해야하므로
    socket.emit("answer", answer, roomName);
    console.log("sent the answer");
  });

  // on("answer")는 peerA측에서 돌아가는 코드
  socket.on("answer", (answer) => {
    myPeerConnection.setRemoteDescription(answer);
    console.log("received the answer");
  });

  socket.on("ice", (ice) => {
    myPeerConnection.addIceCandidate(ice);
    console.log("received candidate");
  });
}

export default client;
