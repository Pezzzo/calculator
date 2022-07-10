let ops = {'+':1,
        '-':1,
        '/':2,
        '*':2
    };
    let s = '9*(6+7/2-5+4)*(7+4*5-1)+3'.split('');
    let stack = [];
    let out = '';
    for (var i = 0; i < s.length; i++) {
        if(!isNaN(s[i])){
            out += s[i];
        }
        if(isNaN(s[i])){
          let a = stack[stack.length - 1];
            if(stack.length == 0) {stack.push(s[i])}
            else {
                if (s[i] == '(' || a == '(') {stack.push(s[i])}
                if(ops[a] >= ops[s[i]]) {
                    out += a;
                    stack.pop();
                    let openBracket = stack.lastIndexOf('(');
                    let n = stack.splice(openBracket + 1).reverse().join('');
                    out += n
                    stack.push(s[i]);
                }
                if(ops[a] < ops[s[i]]) {
                    stack.push(s[i]);
                }
                if(s[i] == ')') {
                    while(stack[stack.length - 1] != '(') {
                        out += stack[stack.length - 1];
                        stack.pop();
                    }
                    stack.pop();
                }
            }
        }
    }
    if (stack.length != 0) {
        while(stack.length > 0) {
            out += stack[stack.length - 1];
            stack.pop();
        }
    }
    console.log('out is',out);
