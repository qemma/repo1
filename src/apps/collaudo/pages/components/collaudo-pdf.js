// @flow
import * as React from "react";
import {
  BlobProvider,
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

import uniqueId from "uniqid";
import { PiramisContext } from "../../../shared/piramis-context";
import { Button } from "primereact/button";
import SignatureCanvas from "react-signature-canvas";
import moment from "moment";
import { ProgressBar } from "primereact/progressbar";

Font.register(
  `${window.location.protocol}//${
    window.location.host
  }/assets/gis/Lato-Bold.ttf`,
  {
    family: "Lato Bold"
  }
);

Font.registerHyphenationCallback(word => [word]);

let sign;
// Create styles
const styles = StyleSheet.create({
  page: {
    padding: "20px",
    color: "#000"
  },
  formField: {
    fontSize: "10pt",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: "5px"
  },
  fieldLabel: {
    fontFamily: "Lato Bold",
    color: "#9D9D9D",

    flexDirection: "row",
    marginRight: "15px",
    alignItems: "center"
  },
  fieldValue: {
    fontFamily: "Lato Bold",
    flexDirection: "row",
    alignItems: "center",
    color: "#000000",
    borderBottom: "1pt",
    flex: 1,
    marginRight: "15px",
    minHeight: "10pt"
    //textAlign: 'center'
    // width: '100%'
  },
  section: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    border: "1pt"
  },

  disclaimer: {
    fontSize: "7pt",
    marginTop: "20px"
  },
  contractDetails: {
    fontSize: "7pt",
    marginBottom: "10px"
  },
  headings: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  leftSignature: {
    borderRight: "1pt",
    flex: 1,
    marginRight: "5px",
    textAlign: "center"
  },
  rightSignature: {
    flex: 1
  }
});

export default function PdfReport(props: {
  dockey: string,
  collaudo: {
    vehicleData: any,
    deviceData: any,
    validSelection: any,
    collaudoResult: any,
    docs: Array<any>
  },
  onCollaudoEnd: Function
}) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService } = context;
  const [signature: any, setSignature] = React.useState();
  const [idCollaudo: string, setIdCollaudo] = React.useState();
  const [pdfBlob: any, setPdfBlob] = React.useState();
  const [progress: any, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (pdfBlob) {
      uploadPdf(pdfBlob);
    }
  }, [pdfBlob]);

  function signModule() {
    if (!sign.isEmpty()) {
      const image = sign.toDataURL();
      console.log(image);
      setIdCollaudo(uniqueId());
      setSignature(image);
    }
  }

  async function uploadPdf(blob: any) {
    setProgress(0);
    const file = await entityService.upload(
      blob,
      `${props.dockey}esito-collaudo-${idCollaudo || ""}.pdf`,
      (prog, total) => {
        const progress = (prog * 100) / total;
        setProgress(Math.round(progress));
      }
    );
    await props.onCollaudoEnd(file, idCollaudo);
  }

  const CollaudoPDF = () => {
    const customer = props.collaudo.vehicleData.customer;
    const vehicle = props.collaudo.vehicleData.vehicle;
    const device = props.collaudo.deviceData.device;
    const order = props.collaudo.deviceData.order;
    const position = props.collaudo.collaudoResult.steps.renderedSteps.find(
      el => el.id === "test-posizione" && el.value.completed
    );

    const sats = position && position.value.position.attributes.sat;

    const address = position && position.value.address;
    return (
      <Document
        author="Piramis"
        keywords="esito collaudo"
        title="Esito collaudo"
      >
        <Page size="A4" style={styles.page}>
          <View style={styles.headings}>
            <Image
              src="/assets/gis/header.png"
              style={{ width: "200pt", display: "flex" }}
            />
            <Text
              style={{ fontSize: 13, display: "flex", fontFamily: "Lato Bold" }}
            >
              {labels.get("CERTIFICATO DI INSTALLAZIONE E COLLAUDO")}
            </Text>
          </View>
          <View style={styles.section}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>
                {labels.get("Nome Cognome / Ragione Sociale")}
              </Text>
              <Text style={styles.fieldValue}>{`${
                customer.name
              } ${customer.surname || " "}`}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>{labels.get("Indirizzo")}</Text>
              <Text style={styles.fieldValue}>
                {customer.address
                  ? customer.address.formatted_address || " "
                  : " "}
              </Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>{labels.get("Telefono")}</Text>
              <Text style={styles.fieldValue}>{customer.phone || " "}</Text>
              <Text style={styles.fieldLabel}>{labels.get("e-mail")}</Text>
              <Text style={styles.fieldValue}>{customer.mail || ""}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>{labels.get("C.Fiscale")}</Text>
              <Text style={styles.fieldValue}>{customer.taxCode || " "}</Text>
              <Text style={styles.fieldLabel}>{labels.get("P.Iva")}</Text>
              <Text style={styles.fieldValue}>{customer.vatCode}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>{labels.get("IMEI")}</Text>
              <Text style={styles.fieldValue}>{device.imei || " "}</Text>
              <Text style={styles.fieldLabel}>{labels.get("Seriale")}</Text>
              <Text style={styles.fieldValue}>{device.sn || ""}</Text>
              <Text style={styles.fieldLabel}>{labels.get("Telefono")}</Text>
              <Text style={styles.fieldValue}>{device.tel || ""}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>
                {labels.get("Numero Ordine")}
              </Text>
              <Text style={styles.fieldValue}>{order.code}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>{labels.get("Rif Ordine")}</Text>
              <Text style={styles.fieldValue}>{order.reference1}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>{labels.get("Del")}</Text>
              <Text style={styles.fieldValue}>
                {moment(order.creationDate).format("DD/MM/YYYY")}
              </Text>
              <Text style={styles.fieldLabel}>
                {labels.get("Consegnato il")}
              </Text>
              <Text style={styles.fieldValue}>
                {moment(order.deliveryDate).format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>
                {labels.get("Marca e Modello")}
              </Text>
              <Text style={styles.fieldValue}>{`${vehicle.make} ${
                vehicle.model
              } ${vehicle.preparation}`}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>{labels.get("Telaio")}</Text>
              <Text style={styles.fieldValue}>{vehicle.frame || " "}</Text>
              <Text style={styles.fieldLabel}>{labels.get("Targa")}</Text>
              <Text style={styles.fieldValue}>{vehicle.plate || ""}</Text>
              <Text style={styles.fieldLabel}>
                {labels.get("Immatricolazione")}
              </Text>
              <Text style={styles.fieldValue}>
                {vehicle.registrationDate
                  ? moment(vehicle.registrationDate).format("DD/MM/YYYY")
                  : ""}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>
                {labels.get("Cod collaudo")}
              </Text>
              <Text style={styles.fieldValue}>{idCollaudo}</Text>
              <Text style={styles.fieldLabel}>{labels.get("Data")}</Text>
              <Text style={styles.fieldValue}>
                {moment().format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>
                {labels.get("Indirizzo rilevato")}
              </Text>
              <Text style={styles.fieldValue}>{address}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>
                {labels.get("Numero Satelliti rilevati")}
              </Text>
              <Text style={styles.fieldValue}>{sats}</Text>
              <Text style={styles.fieldLabel}>
                {labels.get("Test Blocco Avviamento")}
              </Text>
              <Text style={styles.fieldValue}>{labels.get("OK")}</Text>
              <Text style={styles.fieldLabel}>
                {labels.get("Test Sottochiave")}
              </Text>
              <Text style={styles.fieldValue}>{labels.get("OK")}</Text>
            </View>
          </View>

          <View style={[styles.section, { padding: 0, flexDirection: "row" }]}>
            <View style={styles.leftSignature}>
              <Text style={{ fontSize: "6pt", fontFamily: "Lato Bold" }}>
                {labels.get(`Timbro e firma dell'installatore`)}
              </Text>
              <Image src={signature} />
              <Text style={{ fontSize: "6pt" }}>
                {labels.get(`Si dichiara di aver eseguito l'installazione a regola d'arte ed aver collaudato il dispositivo ed i
suoi componenti nel rispetto delle norme vigenti in materia di sicurezza`)}
              </Text>
            </View>
            <View style={styles.rightSignature}>
              <Text
                style={{
                  fontSize: "6pt",
                  fontFamily: "Lato Bold",
                  textAlign: "center"
                }}
              >
                {labels.get(`Connessioni`)}
              </Text>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>{labels.get("+30")}</Text>
                <Text style={styles.fieldValue}>{""}</Text>
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>{labels.get("GND")}</Text>
                <Text style={styles.fieldValue}>{""}</Text>
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>{labels.get("+15")}</Text>
                <Text style={styles.fieldValue}>{""}</Text>
              </View>
              <View style={[styles.formField, { marginBottom: "3px" }]}>
                <Text style={styles.fieldLabel}>{labels.get("+50")}</Text>
                <Text style={styles.fieldValue}>{""}</Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>
                {labels.get("Data inizio contratto")}
              </Text>
              <Text style={[styles.fieldValue, { flex: 1 }]}>
                {moment().format("DD/MM/YYYY")}
              </Text>
              <Text style={styles.fieldLabel}>
                {labels.get("Anni sottoscritti alla firma")}
              </Text>
              <Text
                style={[styles.fieldValue, { flex: 0.5, textAlign: "center" }]}
              >
                {3}
              </Text>
              <Text style={styles.fieldLabel}>
                {labels.get("Data prossimo rinnovo")}
              </Text>
              <Text style={[styles.fieldValue, { flex: 1 }]}>
                {moment()
                  .add(3, "years")
                  .format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>
          <View style={styles.disclaimer}>
            <Text>
              {labels.get(`Il cliente dichiara di approvare ed accettare espressamente, anche ai sensi degli art. 1341 e ss. c.c., le condizioni generali del "contratto di utilizzo servizi Piramis", con
particolare riferimento alle clausole specificate sul retro del presente modulo, prendendo atto che le stesse in ogni caso risultano integralmente riportate e visibili sul
sito www.piramisgroup.com e che dalla data di decorrenza indicata il predetto contratto dovrà considerarsi valido ed efficace a tutti gli effetti di legge. Dichiaro di aver ricevuto
l'informativa orale di cui all'art.13 D.lgs n.196/2003, in materia di privacy come specificata al p.to 5 della condizioni generali in calce al presente modulo, e di acconsentire al
trattamento dei miei dati personali, anche sensibili, autorizzando a tal fine Piramis srl, nei limiti e per le finaltà inerenti il contratto in essere.`)}
            </Text>
          </View>
          <View
            style={[
              styles.section,
              {
                padding: 0,
                flexDirection: "row",
                border: 0,
                justifyContent: "space-between"
              }
            ]}
          >
            <View
              style={[styles.leftSignature, { border: "1pt", padding: "5px" }]}
            >
              <Text style={{ fontSize: "6pt", fontFamily: "Lato Bold" }}>
                {labels.get(`Firma del Titolare`)}
              </Text>
              <Text style={{ minHeight: "30px" }}>{""}</Text>
              <Text style={{ fontSize: "6pt" }}>
                {labels.get(`Si prende atto del corretto funzionamento dell’apparato e dei servizi e si dichiara di aver ricevuto copia di
tutta la documentazione incluso il presente certificato di collaudo.`)}
              </Text>
            </View>
            <View
              style={[styles.rightSignature, { border: "1pt", padding: "5px" }]}
            >
              <Text
                style={{
                  fontSize: "6pt",
                  fontFamily: "Lato Bold",
                  textAlign: "center"
                }}
                break
              >
                {labels.get(`Firma Piramis`)}
              </Text>
            </View>
          </View>
        </Page>
        <Page size="A4" style={styles.page}>
          <Text style={styles.contractDetails}>
            {labels.get(`La società Piramis s.r.l., quale società di servizi dedicata allo sviluppo di progetti telematici, si occupa, tra le altre, della fornitura e gestione di un servizio telematico per la cui
fruizione è utilizzato uno strumento Web chiamato “piattaforma” + APP per piattaforme Android e iOS. Per la raccolta dei dati necessari alla fruizione del servizio stesso,
Piramis s.r.l. si avvale dell’utilizzo di un dispositivo di geolocalizzazione satellitare anche di terze parti, di seguito denominato “dispositivo”.
Le premesse, così come gli allegati e le appendici formano parte integrante del presente contratto.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`1. Con il presente contratto, la società Piramis s.r.l. fornisce il servizio di cui in premessa, il dispositivo a corredo deve essere installato sul veicolo del cliente presso un centro
autorizzato, con spese a carico del cliente stesso.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(
              `2. L’installatore convenzionato risponderà direttamente nei confronti del cliente della corretta ed a regola d’arte installazione nonché di tutte le eventuali operazioni di manutenzione effettuate e dei danni derivanti da tali operazioni.`
            )}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`2.1. L’installazione del dispositivo comporterà, in favore del cliente, l’utilizzo ed il godimento di tutti i servizi telematici ad esso connessi ed in specie un abbonamento che
prevede l’utilizzo della piattaforma dedicata, mediante registrazione, nonché la possibilità di scaricare ed utilizzare le App dedicate iOS e Android, ivi compresa l’assistenza
attraverso il numero verde dedicato (800192774) e tutti gli aggiornamenti necessari al buon funzionamento del sistema.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`3. Il cliente si impegna ad adibire il dispositivo al veicolo indicato nella procedura di registrazione e a non installarlo su altri veicoli, se non previo avviso alla Società da
effettuarsi secondo la procedura indicata nel Sito (www.PiraisGroup.it) nonché ad assicurarsi che i dati richiesti per la registrazione ed indicati nell’account personale siano corretti
ed aggiornati per tutta la durata dell’abbonamento.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`
3.1. Il cliente si impegna altresì a mantenere in buono stato il dispositivo installato e ad utilizzarlo solo per scopi connessi alla fruizione dei servizi offerti dalla società Piramis
s.r.l. e regolati nel presente contratto, senza manometterlo nemmeno in caso di malfunzionamento. La scheda telefonica abbinata al dispositivo è parte integrante dello stesso
e di proprietà di Piramis e non va rimossa in nessun caso.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`3.2. Nel caso di violazione di una o più delle garanzie previste al punto 3 che precede, Piramis s.r.l. potrà sospendere l’erogazione dei Servizi sino a quando il Cliente non avrà
adempiuto. La sospensione dei servizi non sospenderà l’abbonamento.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`3.3. Non è previsto il tacito rinnovo dell’abbonamento; pertanto, in prossimità della scadenza triennale, al cliente perverrà un avviso ai fini del rinnovo e, in mancanza di
pagamento del canone pattuito, il dispositivo come la SIM contenuta all’interno dello stesso, verranno disabilitati e sarà cura del Cliente decidere se procedere o meno alla
disinstallazione del dispositivo.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`4. Nelle ipotesi di inosservanza, inadempimento e/o inesatto adempimento delle obbligazioni previste ai p.ti 2 e 3, il contratto dovrà intendersi risolto di diritto, ai sensi e per gli
effetti dell'art.1456 c.c., allorquando la parte che ha interesse ne dà comunicazione all'altra, Piramis s.r.l. potrà trattenere gli importi ricevuti dal cliente per le prestazioni già
eseguite, salvo il diritto al risarcimento del danno.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`5. Privacy:`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`5.1. Piramis s.r.l. garantisce che il trattamento dei dati personali si svolga nel pieno rispetto dei diritti, delle libertà fondamentali e della dignità delle persone fisiche, con
particolare riferimento alla riservatezza ed all'identità personale, impedendo l'accesso alle informazioni da parte di terzi non autorizzati.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`5.2. I dati personali oggetto del trattamento da parte di Piramis s.r.l. saranno custoditi e controllati in modo da ridurre al minimo i rischi di distruzione o perdita anche
accidentale dei dati stessi, di accesso non consentito o non conforme alla finalità della raccolta.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`5.3. Piramis s.r.l. si impegna a rispettare il Decreto Legislativo del 30 giugno 2003 n. 196 "Codice in materia di protezione dei dati personali" ed ad adempiere a tutte le
disposizioni di legge.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`5.4. Piramis s.r.l. si impegna a non comunicare, diffondere o trasferire a terzi i dati personali del Cliente. Piramis s.r.l. si impegna inoltre a non utilizzare le informazioni
trasmesse dal Dispositivo per finalità diverse da quelle necessarie all'erogazione dei Servizi. Piramis s.r.l. garantisce altresì il rispetto degli obblighi di cui al presente paragrafo
anche da parte dei propri dipendenti o collaboratori autonomi.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`5.5. Il Cliente prende atto che la fornitura dei Servizi relativi ai dati rilevati dal Dispositivo installato sul suo Veicolo comporta che Piramis s.r.l. acquisisca tutti i dati rilevati da
tale Dispositivo.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`5.6. Con la stipula del presente Contratto il Cliente quindi autorizza e delega Piramis s.r.l. all'acquisizione dei dati suddetti nonché alla loro memorizzazione in banche dati
Piramis s.r.l. ed alla loro conservazione fino alla scadenza del servizio.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`6. All'atto dell'attivazione dell'abbonamento e del servizio che costituiscono oggetto del presente contratto, al Cliente viene consegnata una tessera contenente i codici
necessari alla registrazione e attivazione delle piattaforme; mentre al momento della creazione di un account sul sito viene richiesta una password per proteggere le
informazioni relative allo stesso. Il Cliente è responsabile del mantenimento della riservatezza dei suddetti codici, username e password. Il possesso e la conoscenza degli
stessi da parte di terze persone, in assenza di specifica comunicazione di denuncia in merito a smarrimenti e/o furti, legittima Piramis s.r.l. a rilasciare informazioni in merito al
servizio oggetto del presente contratto, la quale in tali casi sarà autorizzata in tal senso e liberata da ogni responsabilità anche per le finalità di informazioni fornite alle forze
dell’ordine`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`6.1. Divulgazioni e trasferimenti informazioni:`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`6.2. Piramis s.r.l. si impegna a non divulgare le informazioni ed i dati personali degli utenti a terzi, salve le seguenti eccezioni:
a) utilizzo del servizio per attività illegali e/o coinvolgimento del Cliente in attività illegali; b) richiesta da parte di autorità statali, giudiziarie, di polizia, di vigilanza, forze
dell'Ordine e similari, anche in assenza di uno specifico ordine o mandato giudiziario e in ogni caso in cui si dovesse rendere necessaria la divulgazione, nel rispetto delle
leggi, in collaborazione con le suddette autorità, nei confronti di utenti che dovessero risultare impegnati o coinvolti in attività illegali; c) comunicazione e/o possesso dei codici
contenuti nella tessera di cui al p.to precedente.`)}
          </Text>
          <Text style={styles.contractDetails}>
            {labels.get(`6.3. Piramis s.r.l. si riserva il diritto di segnalare alle Forze dell'Ordine eventuali attività considerate illegali ed in violazione di disposizioni di legge.8.
7. Per ogni controversia che dovesse insorgere relativamente all’interpretazione ed esecuzione del presente contratto si osserverà la competenza del Foro di residenza del
Cliente/Consumatore.`)}
          </Text>
        </Page>
      </Document>
    );
  };

  return (
    <div className="p-grid w-full">
      {!signature && (
        <div className="p-col-12">
          <h2>{labels.get("Firma e registra collaudo")}</h2>

          <div style={{ width: "520px", padding: "10px" }}>
            <SignatureCanvas
              penColor="black"
              backgroundColor="#fff"
              canvasProps={{
                width: "500px",
                height: "100px",
                className: "sigCanvas"
              }}
              ref={ref => {
                if (ref) {
                  sign = ref;
                }
              }}
            />

            <div className="w-full mt-2">
              <Button
                label={labels.get("cancella")}
                icon="fas fa-trash"
                onClick={() => sign.clear()}
                className={`p-button-danger p-button-rounded`}
              />

              <Button
                label={labels.get("conferma")}
                icon="fas fa-signature"
                style={{ marginLeft: "5px" }}
                onClick={signModule}
                className={`p-button-success p-button-rounded`}
              />
            </div>
          </div>
        </div>
      )}
      {signature && (
        <div className="p-col-12">
          <ProgressBar value={progress} />
        </div>
      )}
      {signature && (
        <BlobProvider document={<CollaudoPDF />}>
          {({ blob, url, loading, error }) => {
            if (!loading && !pdfBlob) {
              setPdfBlob(blob);
            }
            return null;
          }}
        </BlobProvider>
      )}
    </div>
  );
}
