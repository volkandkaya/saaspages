;[...document.querySelectorAll('[data-dt-idx]')]
  .filter(e => {
    console.log(e, e.innerHTML)
    return e.innerHTML === '78'
  })[0]
  .click()

$('#companyDataGrid')
  .DataTable()
  .rows()
  .data()
