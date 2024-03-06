import 'bootstrap/dist/css/bootstrap.min.css'

import { Container, Row, Col, Button, Stack } from 'react-bootstrap'
import './App.css'
import { useStore } from './hooks/useStore'
import { AUTO_LANGUAGE, VOICE_FOR_LANGUAGE } from './constants'
import { ArrowsIcon, ClipboardIcon, TextToVoice } from './components/Icons'
import { LanguageSelector } from './components/LanguageSelector'
import { SectionType } from './types.d'
import { TextArea } from './components/TextArea'
import { useEffect } from 'react'
import { translate } from './services/translate'
import { useDebounce } from './hooks/useDebounce'
import { ToastContainer, toast } from 'react-toastify'
import { Example } from './components/toastit'

function App() {
  const {
    loading,
    fromLanguage,
    toLanguage,
    fromText,
    result,
    interchangeLanguages,
    setFromLanguage,
    setToLanguage,
    setFromText,
    setResult
  } = useStore()

  const debouncedFromText = useDebounce(fromText)

  useEffect(() => {
    if (debouncedFromText === '') return
    translate({ fromLanguage, toLanguage, text: debouncedFromText })
      .then(result => {
        if (result == null) return
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setResult(result)
      })
      .catch(() => { setResult('Error') })
  }, [debouncedFromText, fromLanguage, toLanguage])

  const handleClipboard = () => {
    navigator.clipboard.writeText(result)
      .then(() => {
        console.log('debe mostrar el toast')
        toast.success('Copiado al portapapeles')
      })
      .catch(() => {})
  }

  const handleSpeakTo = () => {
    const utterance = new SpeechSynthesisUtterance(result)
    utterance.lang = VOICE_FOR_LANGUAGE[toLanguage]
    utterance.rate = 0.75
    speechSynthesis.speak(utterance)
    console.log(toLanguage)
  }

  const handleSpeakFrom = () => {
    const utterance = new SpeechSynthesisUtterance(fromText)
    console.log(fromLanguage)
    // utterance.lang = VOICE_FOR_LANGUAGE[fromLanguage]
    if (fromLanguage === 'auto') {
      utterance.lang = 'es-MX'
    } else {
      // Aquí puedes manejar otros casos específicos para fromLanguage si es necesario
      // Por ejemplo, establecer un idioma predeterminado o dejarlo sin asignar
      utterance.lang = VOICE_FOR_LANGUAGE[fromLanguage]
      console.log(fromLanguage)
    }
    utterance.rate = 0.75
    speechSynthesis.speak(utterance)
  }

  return (
    <Container fluid>
      <h2>Sistemas de Información / Traductor</h2>
      <Row>
        <Col>
          <Stack gap={2}>
            <LanguageSelector
            type= {SectionType.From}
            value={fromLanguage}
            onChange= {setFromLanguage }/>
            <div style={{ position: 'relative' }}>
              <TextArea
                type={SectionType.From}
                value={fromText}
                onChange={setFromText}
              />
              <div style={{ position: 'absolute', left: 0, bottom: 0, display: 'flex' }}>
                <Button
                  variant='link'
                  onClick={ handleSpeakFrom }>
                    <TextToVoice/>
                </Button>
              </div>
            </div>
          </Stack>
        </Col>
        <Col xs='auto'>
          <Button variant='link' disabled= {fromLanguage === AUTO_LANGUAGE} onClick={interchangeLanguages}>
            <ArrowsIcon/>
          </Button>
        </Col>
        <Col>
          <Stack gap={2}>
            <LanguageSelector
            type= {SectionType.To}
            value={toLanguage}
            onChange={setToLanguage}/>
            <div style={{ position: 'relative' }}>
              <TextArea
                loading={loading}
                type={SectionType.To}
                value={result}
                onChange={setResult}
              />
              <div style={{ position: 'absolute', left: 0, bottom: 0, display: 'flex' }}>
                <Button
                  variant='link'
                  onClick={ handleClipboard }>
                    <ClipboardIcon/>
                    <ToastContainer/>
                </Button>
                <Button
                  variant='link'
                  onClick={ handleSpeakTo }>
                    <TextToVoice/>
                </Button>
              </div>
            </div>
          </Stack>
        </Col>
      </Row>
      <div >
        <Example />
      </div>
    </Container>
  )
}

export default App
