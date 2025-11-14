// pages/Settings.jsx
import { useTheme } from '../utils/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-container">
      <h1>Paramètres</h1>
      <div>
        <label>Thème :</label>
        <button onClick={toggleTheme}>
          Basculer vers {theme === 'light' ? 'sombre' : 'clair'}
        </button>
      </div>
    </div>
  );
};

export default Settings;