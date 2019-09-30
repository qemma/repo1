// @flow
import * as React from 'react';
import { PiramisContext } from '../../../../shared/piramis-context';
import ChatBot from '../../../../_components/bot/ChatBot';
import { Alert } from '../../../../_components';
import { ThemeProvider } from 'styled-components';
import TestPositionButtons from './position-answer';
import StartStep, { withReset } from './start-step';
import QuadroTestAnswer from './quadro-answer';
import { LockTestCommand, LockTestCommandVerify } from './blocco-answer';
import { YesNoQuestion } from './index';

const CACHE_NAME = 'bot_collaudo';
const START_STEP = 'start';
const TestPosition = withReset(
  TestPositionButtons,
  START_STEP,
  CACHE_NAME,
  'TEST POSIZIONE ANNULLATO DA UTENTE'
);
const TestQuadro = withReset(
  QuadroTestAnswer,
  START_STEP,
  CACHE_NAME,
  'TEST QUADRO ANNULLATO DA UTENTE'
);
const LockCommand = withReset(
  LockTestCommand,
  START_STEP,
  CACHE_NAME,
  'TEST BLOCCO ANNULLATO DA UTENTE'
);

const VerifyLockCommand = withReset(
  LockTestCommandVerify,
  START_STEP,
  CACHE_NAME,
  'TEST BLOCCO ANNULLATO DA UTENTE'
);

const theme = {
  background: '#DAE1E7',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#007AD9',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#292836',
  botFontColor: '#fff',
  userBubbleColor: '#7FBCEC',
  userFontColor: '#000'
};

export default function CollaudoBot(props: {
  deviceId: number,
  online: boolean,
  onCollaudoEnd: Function
}) {
  if (!props.deviceId) return null;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, domainData } = context;

  return (
    <div className="p-grid w-full">
      <div className="p-col-12">
        <ThemeProvider theme={theme}>
          <ChatBot
            botAvatar="assets/layout/images/logo_piramis.png"
            headerTitle={labels.get('Flusso di collaudo')}
            speechSynthesis={{ enable: false, lang: 'it' }}
            inputAttributes={{ style: { display: 'none' } }}
            bubbleStyle={{ maxWidth: 'unset' }}
            hideSubmitButton
            cache
            cacheName={CACHE_NAME}
            enableMobileAutoFocus
            style={{
              width: '100%',
              zIndex: '0',
              height: '365px',
              fontFamily: 'unset'
            }}
            handleEnd={props.onCollaudoEnd}
            contentStyle={{ height: '300px', padding: '10px' }}
            steps={[
              {
                id: START_STEP,
                component: (
                  <StartStep
                    labels={labels}
                    triggerPosition="test-posizione-start"
                    triggerQuadro="test-quadro-start"
                    triggerBlocco="test-blocco-start"
                    endPosition="test-posizione-end"
                    endQuadro="test-quadro-end"
                    endBlocco="test-blocco-end"
                    finalBlock="collaudo-end"
                  />
                ),
                waitAction: true,
                replace: true,
                asMessage: true,
                hideInput: true
              },
              {
                id: 'test-posizione-start',
                trigger: 'test-posizione',
                message: `Accertarsi che il sistema rilevi le posizioni in tempo reale. Il numero dei satelliti deve essere superiore alla soglia minima di ${
                  domainData.appSettings.satLimit
                }.`,
                hideInput: true
              },
              {
                id: 'test-posizione',
                hideInput: true,
                component: <TestPosition trigger="test-posizione-end" deviceId={props.deviceId} />,
                waitAction: true,
                asMessage: true
              },
              {
                id: 'test-posizione-end',
                hideInput: true,
                component: (
                  <Alert
                    color="green"
                    title={labels.get('TEST POSIZIONE COMPLETATO!')}
                    content={<div>{labels.get('TEST POSIZIONE COMPLETATO!')}</div>}
                  />
                ),
                asMessage: true,
                trigger: START_STEP
              },
              {
                id: 'test-quadro-start',
                hideInput: true,
                message: `Il test del quadro serve per verificare che lo stato del quadro del veicolo (acceso, spento) coincida con quello rilevato. Si prega di accendere il quadro del veicolo, attendere qualche istante e verificare.`,
                trigger: 'test-quadro-on'
              },
              {
                id: 'test-quadro-on',
                hideInput: true,
                waitAction: true,
                component: (
                  <TestQuadro verify="on" trigger="test-quadro-on-ok" deviceId={props.deviceId} />
                ),
                asMessage: true
              },
              {
                id: 'test-quadro-on-ok',
                hideInput: true,
                message: `Lo stato segnalato corrisponde con quello rilevato!`,
                trigger: 'test-quadro-off-desc'
              },
              {
                id: 'test-quadro-off-desc',
                hideInput: true,
                message: `Si prega di spegnere il quadro del veicolo e di verificare.`,
                trigger: 'test-quadro-off'
              },
              {
                id: 'test-quadro-off',
                hideInput: true,
                waitAction: true,
                component: (
                  <TestQuadro verify="off" deviceId={props.deviceId} trigger="test-quadro-off-ok" />
                ),
                asMessage: true
              },
              {
                id: 'test-quadro-off-ok',
                hideInput: true,
                message: `Lo stato segnalato corrisponde con quello rilevato!`,
                trigger: 'test-quadro-end'
              },
              {
                id: 'test-quadro-end',
                hideInput: true,
                component: (
                  <Alert
                    color="green"
                    title={labels.get('TEST QUADRO COMPLETATO!')}
                    content={<div>{labels.get('TEST QUADRO COMPLETATO!')}</div>}
                  />
                ),
                asMessage: true,
                trigger: START_STEP
              },
              {
                id: 'test-blocco-start',
                hideInput: true,
                message: labels.get(
                  `Si prega di accendere il motore della vettura ed attendere qualche secondo. Procedere poi con il test di blocco.`
                ),
                trigger: 'test-blocco-1'
              },
              {
                id: 'test-blocco-1',
                hideInput: true,
                component: (
                  <LockCommand
                    deviceId={props.deviceId}
                    trigger="test-blocco-1-verify"
                    command="lock"
                  />
                ),
                waitAction: true,
                asMessage: true
              },
              {
                id: 'test-blocco-1-verify',
                hideInput: true,
                waitAction: true,
                component: (
                  <VerifyLockCommand
                    deviceId={props.deviceId}
                    trigger="test-blocco-1-ignition-stopped"
                    verify="lock"
                  />
                ),
                asMessage: true
              },
              {
                id: 'test-blocco-1-ignition-stopped',
                hideInput: true,
                message: labels.get(
                  `Provare ad avviare il motore. Con il dispositivo in stato di blocco il veicolo NON deve mettersi in moto. Confermi il blocco del motore?`
                ),
                trigger: 'test-blocco-1-ignition-stopped-answer'
              },
              {
                id: 'test-blocco-1-ignition-stopped-answer',
                hideInput: true,
                waitAction: true,
                component: (
                  <YesNoQuestion
                    question={labels.get(`Il motore si trova in stato di blocco e non si accende?`)}
                    yesTrigger="test-sblocco-1"
                    noTrigger="test-blocco-1-ignition-stopped-failure"
                    yesLabel={labels.get(`SI IL MOTORE E' BLOCCATO`)}
                    noLabel={labels.get(`NO, RIPETI LA VERIFICA`)}
                  />
                ),
                asMessage: true
              },
              {
                id: 'test-blocco-1-ignition-stopped-failure',
                hideInput: true,
                component: (
                  <Alert
                    color="red"
                    title={labels.get('Errore verifica blocco/sblocco motore')}
                    content={
                      <div>
                        {labels.get(
                          `Test fallito. Si prega di verificare l’installazione (Blocco Avviamento +50) per poi ripetere il test.`
                        )}
                      </div>
                    }
                  />
                ),
                asMessage: true,
                trigger: 'test-blocco-start'
              },
              {
                id: 'test-sblocco-1',
                hideInput: true,
                component: (
                  <LockCommand
                    deviceId={props.deviceId}
                    trigger="test-sblocco-1-verify"
                    command="unlock"
                  />
                ),
                waitAction: true,
                asMessage: true
              },
              {
                id: 'test-sblocco-1-verify',
                hideInput: true,
                waitAction: true,
                component: (
                  <VerifyLockCommand
                    deviceId={props.deviceId}
                    trigger="test-sblocco-1-ignition-on"
                    verify="unlock"
                  />
                ),
                asMessage: true
              },
              {
                id: 'test-sblocco-1-ignition-on',
                hideInput: true,
                message: labels.get(
                  `Provare ad avviare il motore. Con il dispositivo in stato di sblocco il veicolo DEVE mettersi in moto. Confermi la messa in moto?`
                ),
                trigger: 'test-sblocco-1-ignition-on-answer'
              },
              {
                id: 'test-sblocco-1-ignition-on-answer',
                hideInput: true,
                waitAction: true,
                component: (
                  <YesNoQuestion
                    question={labels.get(`Il motore si accende correttamente?`)}
                    yesTrigger="test-blocco-end"
                    noTrigger="test-blocco-1-ignition-stopped-failure"
                    yesLabel={labels.get(`SI IL MOTORE SI E' ACCESO`)}
                    noLabel={labels.get(`NO, RIPETI LA VERIFICA`)}
                  />
                ),
                asMessage: true
              },
              {
                id: 'test-blocco-end',
                hideInput: true,
                component: (
                  <Alert
                    color="green"
                    title={labels.get('TEST BLOCCO COMPLETATO!')}
                    content={<div>{labels.get('TEST BLOCCO COMPLETATO!')}</div>}
                  />
                ),
                asMessage: true,
                trigger: START_STEP
              },
              {
                id: 'collaudo-end',
                hideInput: true,
                message: labels.get(`GRAZIE E ARRIVEDERCI!!`),
                end: true
              }
            ]}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
