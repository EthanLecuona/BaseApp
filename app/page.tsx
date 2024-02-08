export default async function Home() {
  if(process.env.AWE_REGION){
    console.log('Hi')
  }
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to my home!</p>
    </div>
    
  );
}
