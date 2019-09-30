This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


Utenti:
veicolo e cliente verranno inseriti in fase di vendita
è il venditore che li inserisce
Creare il modulo di vendita e togliere le voce cliente e veicolo

Stampare in orizzontale 62 larghezza x 29 lunghezza
il rotolo è lungo 50 metri
Capire se conviene passare tramite pdf per stampare


Marketing vedono solo le info sulle campagne marketing
Bo avrà accesso alle anagrafiche di qualunque venditore
Il venditore deve invece creare e cancellare i nuovi utenti

Per la gestione dei dispositivi manca l'associazione tra dispositivi e dealer
Schermata spedizione: scelgo il dealer, quanti dispositivi spedire, un campo dove andrò a leggere il serial number o ccid abbinati.
Indicare il corriere e il track number.
Data di spedizione e riferimento al ddt
Quando confermo quelli vengono spostati in stato spedito.
Questo chiude la fase logistica.

Sito di Miki:
Nuova pagina spedizione con le spedizioni in corso.
Sarà vista da un operatore di tipo logistica.

Associare un cliente al veicolo e ad un dispositivo a magazzino del cliente.
Non importa che sia consegnato. Basta che sia non installato o in fase di collaudo.
Non ho capito il discorso dei prezzi.

I servizi serviranno dopo. sarà il rinnovo dopo 3 anni di servizio dalla data di collaudo.
Noi invece creaiamo il prodotto rinnovo.

Verrà creata l'anagrafica prodotti da parte di superadmin. Non deve essere il dealer a farlo.
Ogni prodotto può essere venduto da ogni dealer al prezzo che decide lui.
Nome, descrizione, note, durata in anni, prezzo.
