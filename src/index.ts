export class ReadAloudApi {
    public voices: SpeechSynthesisVoice[]
    private _selectedVoice: SpeechSynthesisVoice | null
    private _utterance: SpeechSynthesisUtterance | null
    constructor() {
        if (!this.isSupported()) {
            throw new Error('Syntheses API is not supported in this browser')
        }
        this.voices = []
        this._utterance = null
        this._selectedVoice = null
        window.onload = () => this.populateVoiceList()
    }

    public isChrominiumBased(): boolean {
        const chrome = /chrome/i.test(navigator.userAgent)
        const edge = /edge/i.test(navigator.userAgent)
        return chrome && !edge
    }

    public isSupported(): boolean {
        return 'speechSynthesis' in window
    }

    public get selectedVoice(): SpeechSynthesisVoice | null {
        return this._selectedVoice
    }

    public get utterance(): SpeechSynthesisUtterance | null {
        return this._utterance
    }

    public selectVoice(voice: SpeechSynthesisVoice): void {
        this._selectedVoice = voice
    }

    public speak(
        sentence: string,
        voice: SpeechSynthesisVoice,
        onStart?: (ev: SpeechSynthesisEvent) => void,
        onEnd?: (ev: SpeechSynthesisEvent) => void,
        voiceSpeed = 1,
        volume = 1,
        rate = 1,
    ): void {
        if (!sentence) {
            throw new Error('sentence is required')
        }
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel()
        }
        voice = voice || this.selectedVoice
        if (!voice) {
            throw new Error('voice is required')
        }
        this._utterance = new window.SpeechSynthesisUtterance(sentence)
        this._utterance.voice = voice
        this._utterance.volume = volume
        this._utterance.pitch = voiceSpeed
        this._utterance.rate = rate
        if (onStart) {
            this._utterance.addEventListener('start', (ev) => onStart(ev))
        }
        if (onEnd) {
            this._utterance.addEventListener('end', (ev) => onEnd(ev))
        }
        speechSynthesis.speak(this._utterance)
    }

    public populateVoiceList(): Promise<void> {
        return new Promise((resolve, reject) => {
            let count = 1
            const id = setInterval(() => {
                console.log('call interval')
                count++
                const voices = window.speechSynthesis.getVoices()
                if (voices.length !== 0) {
                    for (let i = 0; i < voices.length; i++) {
                        const voice = voices[i]
                        if (!voice) {
                            continue
                        }
                        this.voices.push(voice)
                    }
                    clearInterval(id)
                    resolve()
                }
                if (count >= 100) {
                    clearInterval(id)
                    reject('load voices timeout')
                }
            }, 10)
        })
    }
}

;(window as any).ReadAloudApi = ReadAloudApi
