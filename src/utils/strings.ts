export function makeid(length: number) {
   let result           = '';
   const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   const charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export function preferenceName(name: string){
   const nameSplit = name.split(' ')
   const firstName = nameSplit[0]
   
   return nameSplit.slice(1, nameSplit.length).map(v => {
      return firstName + " " + v
   })
}