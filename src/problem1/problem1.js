var sum_to_n_a = function(n) { //using for loop
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function(n) {  //using algorithm
    return (n * (n + 1)) / 2;
};

var sum_to_n_c = function(n) { //using while  loop
    let sum = 0;
    while (n > 0) {
        sum += n--;
    }
    return sum;
};

// Test
console.log(sum_to_n_a(10));  //sum = 55
console.log(sum_to_n_b(10));  //sum = 55
console.log(sum_to_n_c(10));  //sum = 55