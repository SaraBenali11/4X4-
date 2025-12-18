export const handleSubmit = (email, setEmail) => {
  if (email && email.includes('@')) {
    alert('Merci pour votre inscription!');
    setEmail('');
  }
};
