import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MonacoServices,
  MessageTransports,
} from 'monaco-languageclient';
import {
  toSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from 'vscode-ws-jsonrpc';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { LANGUAGES } from 'types/common';

export default class LanguageServer {
  private readonly MAX_RETRIES = 3;

  private readonly SUPPORTED_LANGUAGE_SERVERS = [LANGUAGES.GROOVY, LANGUAGES.XML];

  private webSocket: WebSocket | undefined;

  private languageClient: MonacoLanguageClient | undefined;

  private monacoServices: { dispose: () => void; } | undefined;

  constructor(private readonly language: LANGUAGES) {

  }

  private createLanguageClient(transports: MessageTransports): MonacoLanguageClient {
    return new MonacoLanguageClient({
      name: `${this.language} Language Client`,
      clientOptions: {
        documentSelector: [this.language],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart }),
        },
      },
      connectionProvider: {
        get: () => {
          return Promise.resolve(transports);
        },
      },
    });
  }

  private handleClose() {
    this.languageClient?.stop();
  }

  public createWebSocket() {
    if (this.SUPPORTED_LANGUAGE_SERVERS.includes(this.language)) {
      const url = `${ENVIRONMENT_VARIABLES.languageServerUrl}/${this.language}`;
      this.webSocket = new ReconnectingWebSocket(url, [], {
        maxRetries: this.MAX_RETRIES,
      }) as WebSocket;

      this.monacoServices = MonacoServices.install();

      this.webSocket.onopen = () => {
        const socket = toSocket(this.webSocket as WebSocket);
        const reader = new WebSocketMessageReader(socket);
        const writer = new WebSocketMessageWriter(socket);
        this.languageClient = this.createLanguageClient({
          reader,
          writer,
        });
        this.languageClient.start();
      };

      this.webSocket.addEventListener('close', this.handleClose.bind(this));
    }
  }

  public closeWebSocket() {
    if (this.webSocket) {
      // Close in a timeout so the language client is not stopped at the exact same time as a websocket
      // Or a error is displayed because it fails to send the didClose notification
      setTimeout(() => {
        this.webSocket?.close();
      }, 0);
      this.webSocket.removeEventListener('close', this.handleClose);
      this.monacoServices?.dispose();
    }
  }
}
