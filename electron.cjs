const {
  app,
  BrowserWindow,
  Tray,
  Menu,
} = require('electron')

const path = require('path')

let win = null
let tray = null
let isQuitting = false

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,

    minWidth: 800,
    minHeight: 600,

    autoHideMenuBar: true,

    show: false,

    icon: path.join(
      __dirname,
      'build',
      'icon.ico'
    ),
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
  const iconPath = path.join(
    __dirname,
    'build',
    'icon.ico'
  )

  tray = new Tray(
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

app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on(
    'activate',
    () => {
      if (!win) {
        createWindow()
      } else {
        win.show()
        win.focus()
      }
    }
  )
})

app.on(
  'window-all-closed',
  () => {
    // Mantém o aplicativo rodando
    // em segundo plano.
  }
)

app.on(
  'before-quit',
  () => {
    isQuitting = true
  }
)