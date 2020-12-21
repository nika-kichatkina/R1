$(document).ready(function() {
  let lexAnal = new LexAnal();

  $('.button').on('click', function(event) {
    
    let string = $('.textarea').val();
    $('.content').html(JSON.stringify(lexAnal.parse(string), null, 2));

  });

   $('.tests').html('');
  for (let variable of inputTestAr) {
    $('.tests').append('Входная строка: ' + variable.inputString + '\n');
    $('.tests').append('Ожидание: ' + JSON.stringify(variable.expectation, null, 2) + '\n');
    $('.tests').append('Результат: ' + JSON.stringify(lexAnal.parse(variable.inputString), null, 2) + '\n');
    $('.tests').append('Статус: ' + lexAnal.test(variable.inputString, variable.expectation) + '\n\n\n');


  }
});
