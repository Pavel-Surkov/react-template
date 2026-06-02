import { MainPage } from '@pages'
import { PopupsProvider } from '@providers'

const App = () => {
  return (
    <PopupsProvider>
      <MainPage />
    </PopupsProvider>
  )
}

export default App
