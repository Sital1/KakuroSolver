export default function Square({value,onChange,disabled,isFillable}) {
  const isBlocked = value === "X";
  const isEmpty = value === "0";
  if(isFillable){
    console.log(value,isFillable)
  }

  const isSum = value.includes('\\') || value.includes('/');

  const cellStyle = {
    border: '1px solid black',
    padding: '10px',
    backgroundColor: isBlocked ? 'grey' : 'white',
    color: isBlocked ? 'white' : 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80px',
    width: '80px',
    fontSize: isSum ? 'small' : 'medium'
  };

  const inputStyle = {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    border: 'none',
    fontSize: 'medium',
    color: 'black',
    backgroundColor: 'transparent'
  };

  const inputStyleRed = {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    border: 'none',
    fontSize: 'medium',
    color: 'red',
    backgroundColor: 'transparent'
  };

 

  return (
    <div style={cellStyle}>
      {
       (isFillable?
         <input 
           style={value.includes("*")?inputStyleRed:inputStyle} 
           type="text" 
           maxLength="1" 
           pattern="[1-9]"
           value={value==="0"?"":value.replace('*', '')}
           inputMode="numeric"
           onChange={onChange} 
           disabled={disabled}
           onKeyDown={(e) => {
             // Prevent non-numeric characters
             if (!/[1-9]/.test(e.key) && e.key !== "Backspace") {
               e.preventDefault();
             }
           }}
         /> 
         : value
       )
      }
    </div>
  );
  }