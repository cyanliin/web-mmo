import '../styles/ChatPanel.scss';

class ChatPanel {
  constructor(engine) {
    this.engine = engine;
    this.wrapperDom = null;
    this.inputDom = null;
    this.historyDom = null;
    this.enableSendMessage = true;
    this.initDoms();
  }

  initDoms() {
    this.wrapperDom = document.createElement('div');
    this.wrapperDom.className = 'wme-chatpanel-wrapper';

    this.inputDom = document.createElement('input');
    this.inputDom.className = 'wme-chatpanel-textarea';
    this.inputDom.setAttribute('type', 'text');
    this.inputDom.addEventListener('keypress', (event) => { this.onInputKeydown(event) });
    this.wrapperDom.appendChild(this.inputDom);

    this.historyDom = document.createElement('div');
    this.historyDom.className = 'wme-chatpanel-history';
    // this.historyDom.innerHTML = "adsfasdfsaf<br/>asdfsfsa<br/>adsfasdfsaf<br/>asdfsfsa<br/>adsfasdfsaf<br/>asdfsfsa<br/>adsfasdfsaf<br/>asdfsfsa<br/>adsfasdfsaf<br/>asdfsfsa<br/>adsfasdfsaf<br/>asdfsfsa<br/>"
    this.wrapperDom.appendChild(this.historyDom);
  }

  onInputKeydown(event) {

    // 按下 Enter
    if(event.key === 'Enter') {

      // 傳送文字
      const text = this.inputDom.value.trim();
      if (text) {
        this.enableSendMessage = false;
        this.engine.networkManager.sendChatMessage(this.engine.localPlayer.name, text);

        // 清除文字
        this.inputDom.value = '';

        setTimeout(() => {
          this.enableSendMessage = true;
        }, 500);
      }

      
    }
  }

  addMessage(from, text, timestamp) {
    // 新增訊息物件
    const msgDom = this.createMessageDom(from, text, timestamp);
    this.historyDom.appendChild(msgDom);

    // 自動滾動到底部
    this.historyDom.scrollTop = this.historyDom.scrollHeight;
  }

  createMessageDom(from, text, timestamp) {
    const msgWrapper = document.createElement('div');
    msgWrapper.className = 'msg-item';

    const msgFrom = document.createElement('div');
    msgFrom.className = 'from';
    msgFrom.innerText = `${from}：`;
    msgWrapper.appendChild(msgFrom);

    const msgText = document.createElement('div');
    msgText.className = 'text';
    msgText.innerText = text;
    msgWrapper.appendChild(msgText);

    return msgWrapper;
  }

  getDom() {
    return this.wrapperDom;
  }
}

export default ChatPanel;