const path = require('path')
const {app, BrowserWindow} = require('electron')
const url = require('url');



const debug = /--debug/.test(process.argv[2])

app.setName('Sync Directories');

const desktopPath = app.getPath(`desktop`)
app.setAppLogsPath(desktopPath);

const logger = require('./winston');

let mainWindow = null;

function initialize(){
    logger.info('initialising electron...');
    makeSingleInstance();

    function createWindow (){
        const windowOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            title: app.getName(),
            webPreferences: {
                nodeIntegration: true
            }
        }

        mainWindow = new BrowserWindow(windowOptions);
        // and load the index.html of the app.
        const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
        });
        mainWindow.loadURL(startUrl)

        if(debug){
            mainWindow.webContents.openDevTools()
            mainWindow.maximize()
            require('devtron').install()
        }

        mainWindow.on('close', () => {
            mainWindow = null
        })
    }

    app.on('ready', () => {
        logger.info('initialising application Sync-Directory-App')
        createWindow();
    })

    app.on('window-all-closed', () => {
        if(process.platform !== 'darwin'){
            app.quit()
        }
    })

    app.on('activate', () => {
        if(mainWindow == null){
            createWindow()
        }
    })
}

function makeSingleInstance(){
    logger.info('acquiring single instance of application')
    if(process.mas) return

    app.requestSingleInstanceLock()

    app.on('second-instance', () => {
        if(mainWindow){
            if(mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}

initialize()