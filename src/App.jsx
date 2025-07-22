import { useCallback, useState, useRef, useEffect } from 'react'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [password, setPassword] = useState('')
  const [charAllowed, setCharAllowed] = useState(false)
  const [strengthLabel,setStrengthLabel]=useState()

  const passwordGenerator = useCallback(() => {
    let pass = ''
    let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    if (numberAllowed) str += '0123456789'
    if (charAllowed) str += "~`!@#$%^&*()-_=+[]{}|;:',.<>?/"

    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length + 1)
      pass += str.charAt(char)
    }
    setPassword(pass)
  }, [length, numberAllowed, charAllowed, setPassword])

  const passwordRef = useRef(null)

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select()
    passwordRef.current?.setSelectionRange(0, length)

    window.navigator.clipboard.writeText(password)
  }, [password, length])

  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  function getStrength(password){
    if (!password) return ""; // no password yet

  let strength = 0;

  if (password.length > 6) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 1) return "Weak";
  else if (strength === 2 || strength === 3) return "Medium";
  else return "Strong";
  }
useEffect(() => {
  const label = getStrength(password);
  setStrengthLabel(label);
}, [password]);


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md shadow-lg rounded-lg px-6 py-5 bg-gray-800 text-orange-500">
        <h1 className="text-white text-3xl text-center font-semibold mb-4">🔐 Password Generator</h1>

        <div className="flex shadow rounded overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-2 px-4 bg-gray-700 text-white placeholder-gray-400"
            placeholder="Your password will appear here"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 transition duration-300"
          >
            Copy
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center justify-between">
            <label className="text-white">Length: {length}</label>
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              className="w-2/3 accent-orange-500 cursor-pointer"
              onChange={(e) => setLength(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="numberInput" className="text-white">Include Numbers</label>
            <input
              type="checkbox"
              id="numberInput"
              checked={numberAllowed}
              className="accent-orange-500 w-4 h-4"
              onChange={() => setNumberAllowed(prev => !prev)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="characterInput" className="text-white">Include Symbols</label>
            <input
              type="checkbox"
              id="characterInput"
              checked={charAllowed}
              className="accent-orange-500 w-4 h-4"
              onChange={() => setCharAllowed(prev => !prev)}
            />
            </div>
            <div className='flex items-center justify-between'>
            <p className='text-white'>Strength :</p>
           <p
                className={
                  strengthLabel === "Weak"
                    ? "text-red-500"
                    : strengthLabel === "Strong"
                    ? "text-green-500"
                    : "text-yellow-500"
                }
              >
                {strengthLabel}
              </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
