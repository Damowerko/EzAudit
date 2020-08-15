# EzAudit Conference Design
The EzAudit conference allows auditors to remotely visit a company guided by one of these employees.
Therefore there are two types of users of the conference app:
* **Guests**: Guests are the ones touring/auditing the company.
* **Host**: They are the ones physically present at the audited company.

## Topology
For simplicity will utilize a mesh (everyone-to-everyone) peer communication. While all guests
and the host will stream audio, only the host will be streaming video (to conserve bandwidth).

## Connecting
We will be using `socket.io` for signaling and WebRTC for messaging after peer connections are
established:

1. Guest connects to socket.io server. The server gives them a unique id.
2. The server emits the ids of all connected users upon connection/disconnection.
3. The user keeps track of all peer ids based on information received from server.
    * Cleanup disconnected ones.
    * Make offer to connected ones.
4. The users communicate their offer, answer and ICECandidates using their ids.
    * eg. `{answer: ..., from: 1, to: 2}`
5. Guests begin voice communication.
6. A guest can promote itself to host by communicating with the server. There is only ever one host
so the previous host gets demoted. (*Not Implemented Yet*)