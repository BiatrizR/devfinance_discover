     //abrir modal
    //adicionar a class active ao modal
const Modal = {
        open(){
            document.querySelector('.modal-overlay')
            .classList.add('active')
        }, 
        
        close(){
            //fechar o modal removendo a class active
            document.querySelector('.modal-overlay')
            .classList.remove('active')
        }
    }

    const Storage = {
        get() {
            return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||
            []
        },
        set(transactions) {
            localStorage.setItem("dev.finances:transactions", JSON.
            stringify(transactions))
        },
    }
    

    //Fazer o total de entradas
    //Somar o total de saídas
    //fazer o cálculo de entradas menos sáidas
    //mostrar o total

const Transaction = {
    all: Storage.get(),
    /*[
        {
           description: 'Luz',
           amount: -50000,
           date: '23/01/2021',
       }, 
      {
           description: 'Website',
           amount: 500000,
           date: '23/01/2021',
       }, 
      {
           description: 'Internet',
           amount: -20000,
           date: '23/01/2021',
       }, 
       {
           description: 'App',
           amount: 200000,
           date: '23/01/2021',
       }, 
   ],*/

    add(transaction){
           Transaction.all.push(transaction)

           App.reload()
        },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()

    },

        // somar as entradas 
    incomes() {
             let income = 0;
             //pegar todas as transações
             Transaction.all.forEach(transaction => {
                 if(transaction.amount > 0) {
                       income += transaction.amount;
                 }
             })


             return income;
         },
         
         //somar as saídas
    expenses() {
            let expense = 0;
            //pegar todas as transações
            Transaction.all.forEach(transaction => {
                if(transaction.amount < 0) {
                      expense += transaction.amount;
                }
            })


            return expense;
         },

         //entradas - saídas
    total() {
             return Transaction.incomes() + Transaction.expenses();
         }
    }

   //Substituir os dados do HTML com os dados do JS

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

       addTransaction(transaction, index) {
            const tr = document.createElement('tr')
            tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) 
            tr.dataset.index = index
            
            DOM.transactionsContainer.appendChild(tr) 
         
       },

       innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação">
        </td>
      `

      return html

       },

       updateBalance() {
           document
             .getElementById('incomeDisplay')
             .innerHTML = Utils.formatCurrency(Transaction.incomes())
           document
             .getElementById('expenseDisplay')
             .innerHTML = Utils.formatCurrency(Transaction.expenses())
           document
             .getElementById('totalDisplay')
             .innerHTML = Utils.formatCurrency(Transaction.total())

       },

       clearTransactions() {
           DOM.transactionsContainer.innerHTML = ""
       }

   }

const Utils = {
    formatAmount(value) {
         value = Number(value) * 100
       
        return Math.round(value)
    },

    FormatDate(date) {
       const splittedDate = date.split("-")
       
       return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
   description: document.querySelector('input#description'),
   amount: document.querySelector('input#amount'),
   date: document.querySelector('input#date'),
    
   getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
   },
   
    validateFields() {
        const { description, amount, date } = Form.getValues()
        
        if(
            description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")
            }
   },


    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount (amount)

        date = Utils.FormatDate (date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
   
    submit(event) {
        event.preventDefault()

        //verificar  se todas as informações foram preenchidas
     try {
        Form.validateFields()
        //formatar os dados para salvar
        const transaction = Form.formatValues()
        //salvar
        Transaction.add(transaction)
        //apagar dados do formulário
        Form.clearFields()
        //fechar modal
        Modal.close()
  }   catch (error) {
            alert(error.message)

        }
    },
} 


const App = {

    init(){

        Transaction.all.forEach((transaction, index)=> {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)

        
    },

     reload() {
         DOM.clearTransactions()
         App.init()
     },
}

App.init()
 