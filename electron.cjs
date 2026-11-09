const {
  app,
  BrowserWindow,
  Tray,
  Menu,
} = require('electron')

const path = require('path')

const {
  autoUpdater,
} = require('electron-updater')

let win = null
let tray = null
let isQuitting = false

function getIconPath() {
  if (app.isPackaged) {
    return path.join(
      process.resourcesPath,
      'icon.ico'
    )
  }

  return path.join(
    __dirname,
    'build',
    'icon.ico'
  )
}

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,

    minWidth: 800,
    minHeight: 600,

    autoHideMenuBar: true,
    show: false,

    icon: getIconPath(),

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      partition: 'persist:talentos-ti',
    },
  })

  if (app.isPackaged) {
    win.loadFile(
      path.join(
        __dirname,
        'dist',
        'index.html'
      )
    )
  } else {
    win.loadURL(
      'http://localhost:5173'
    )
  }

  win.once(
    'ready-to-show',
    () => {
      win.show()
    }
  )

  win.on(
    'close',
    (event) => {
      if (!isQuitting) {
        event.preventDefault()
        win.hide()
      }
    }
  )

  win.on(
    'closed',
    () => {
      win = null
    }
  )
}

function createTray() {
  const iconPath =
    getIconPath()

  tray =
    new Tray(
      iconPath
    )

  const menu =
    Menu.buildFromTemplate([
      {
        label:
          'Abrir Talentos TI',

        click: () => {
          if (!win) {
            createWindow()
            return
          }

          win.show()
          win.focus()
        },
      },

      {
        type:
          'separator',
      },

      {
        label:
          'Sair',

        click: () => {
          isQuitting = true
          app.quit()
        },
      },
    ])

  tray.setToolTip(
    'Talentos TI'
  )

  tray.setContextMenu(
    menu
  )

  tray.on(
    'double-click',
    () => {
      if (!win) {
        createWindow()
        return
      }

      win.show()
      win.focus()
    }
  )
}

/*
 * =========================
 * ATUALIZAÇÃO AUTOMÁTICA
 * =========================
 */

function configurarAtualizador() {
  if (!app.isPackaged) {
    return
  }

  autoUpdater.on(
    'checking-for-update',
    () => {
      console.log(
        'Verificando atualizações...'
      )
    }
  )

  autoUpdater.on(
    'update-available',
    (info) => {
      console.log(
        'Nova atualização disponível:',
        info.version
      )
    }
  )

  autoUpdater.on(
    'update-not-available',
    () => {
      console.log(
        'Nenhuma atualização disponível.'
      )
    }
  )

  autoUpdater.on(
    'download-progress',
    (progresso) => {
      console.log(
        `Download: ${Math.round(
          progresso.percent
        )}%`
      )
    }
  )

  autoUpdater.on(
    'update-downloaded',
    (info) => {
      console.log(
        'Atualização baixada:',
        info.version
      )

      /*
       * Não instala imediatamente.
       * A atualização será aplicada
       * quando o aplicativo sair.
       */
    }
  )

  autoUpdater.on(
    'error',
    (erro) => {
      console.error(
        'Erro na atualização:',
        erro
      )
    }
  )

  autoUpdater
    .checkForUpdatesAndNotify()
    .catch((erro) => {
      console.error(
        'Erro ao verificar atualizações:',
        erro
      )
    })
}

app
  .whenReady()
  .then(() => {
    createWindow()

    createTray()

    configurarAtualizador()

    app.on(
      'activate',
      () => {
        if (!win) {
          createWindow()
          return
        }

        win.show()
        win.focus()
      }
    )
  })

app.on(
  'window-all-closed',
  () => {
    /*
     * Mantém o app ativo
     * por causa do Tray.
     */
  }
)

app.on(
  'before-quit',
  () => {
    isQuitting = true
  }
)