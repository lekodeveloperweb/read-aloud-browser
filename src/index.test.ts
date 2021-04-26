import { ReadAloudApi } from "./index";

describe("index.test.ts", () => {
  let API: ReadAloudApi;
  const voices = [
    {
      default: false,
      lang: "en-US",
      localService: false,
      name: "Microsoft Aria Online (Natural) - English (United States)",
      voiceURI: "Microsoft Aria Online (Natural) - English (United States)",
    },
  ];
  beforeAll(() => {
    require("./index");
    (window as any).speechSynthesis = {
      getVoices: jest.fn((x) => voices),
      speak: jest.fn(),
    };
    (window as any).SpeechSynthesisUtterance = jest.fn((x) => ({
      voice: null,
      volume: 0,
      pitch: 0,
      rate: 0,
      addEventListener: jest.fn(),
    }));
    API = new window.ReadAloudApi();
    API.isChrome = jest.fn(() => true);
    API.isSupported = jest.fn(() => true);
    API.voices = voices;
    API.populateVoiceList = jest.fn();

    window.onload();
  });

  it("should call populateVoiceList on window load", () => {
    expect(API.populateVoiceList.mock.calls.length).toBe(1);
  });
  it("should set a new voice default", () => {
    API.selectVoice(voices[0]);
    expect(API.selectedVoice).toBeDefined();
  });
  it("should return error on try call funcion without sentence", () => {
    expect(() => API.speak(null, null)).toThrowError("sentence is required");
  });
  it("should use default voice if exist on try call funcion without voice", () => {
    API.selectVoice(voices[0]);
    API.speak("this is an example", null);
    expect(window.speechSynthesis.speak).toBeCalled();
  });
  it("should return error on try to call speak without voice and default voice selected", () => {
    API.selectVoice(null);
    expect(() => API.speak("this is an example", null)).toThrowError(
      "voice is required"
    );
  });
  it("should change default properties in utterance", () => {
    API.selectVoice(voices[0]);
    API.speak("This is an example", null, undefined, undefined, 1, 1, 1);
    expect(API.utterance.volume).toBe(1);
    expect(API.utterance.rate).toBe(1);
    expect(API.utterance.pitch).toBe(1);
    expect(window.speechSynthesis.speak).toBeCalledWith(API.utterance);
  });
  it("should add listen to start and end speak event", () => {
    API.selectVoice(voices[0]);
    const startListen = jest.fn();
    const endListen = jest.fn();
    API.speak("This is an example", null, startListen, endListen);
    expect(API.utterance.addEventListener.mock.calls.length).toBe(2);
  });
});
