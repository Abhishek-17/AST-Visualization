
id = function(id){
	return {
		'type': 'id',
		'label': id,
		'eval': null,
		'children': null,
		'class': 'ast-id',
		'env': null,
		'info': {
			'id': id
		}
	}
};

op = function(op){
	return {
		'type': 'op',
		'label': op,
		'eval': null,
		'children': null,
		'class': 'ast-op',
		'env': null,
		'info': {
			'op': op
		}
	}
};

bool = function(value){
	return {
		'type': 'bool',
		'label': value ? "T" : "F",
		'eval': null,
		'children': null,
		'class': 'ast-bool',
		'env': null,
		'info': {
			'bool': value
		}
	};
};

number = function(number){
	return {
		'type': 'number',
		'label': number,
		'eval': null,
		'children': null,
		'class': 'ast-number',
		'env': null,
		'info': {
			'number': number
		}
	};
};

primApp = function(operator, ast1, ast2){
	return {
		'type': 'prim-app',
		'label': operator.label,
		'eval': null,
		'children': [ast1, ast2],
		'class': 'ast-prim-app',
		'env': null,
		'info': {
			'operator': operator,
			'ast1': ast1,
			'ast2': ast2
		}
	};
};

ifThenElse = function(ifAst, thenAst, elseAst){
	return {
		'type': 'if-then-else',
		'label': '?',
		'eval': null,
		'children': [ifAst, thenAst, elseAst],
		'class': 'ast-if-then-else',
		'env': null,
		'info': {
			'ifAst': ifAst,
			'thenAst': thenAst,
			'elseAst': elseAst,
		}
	};
};

idASTBind = function(id, ast){
	return {
		'type': 'id-ast-bind',
		'label': 'B',
		'eval': null,
		'children': [id, ast],
		'class': 'ast-id-ast-bind',
		'env': null,
		'info': {
			'id': id,
			'ast': ast
		}
	};
};

idBinds = function(binds){
	return {
		'type': 'id-binds',
		'label': 'BB',
		'eval': null,
		'children': binds,
		'class': 'ast-id-binds',
		'env': null,
		'info': {
			'binds': binds
		}
	};
};

assume = function(idBinds, body){
	return {
		'type': 'assume',
		'label': 'A',
		'eval': null,
		'children': [idBinds, body],
		'class': 'ast-assume',
		'env': null,
		'info': {
			'idBinds': idBinds,
			'body': body
		}
	};
};

// var ast = primApp( op('+'),
// 		primApp(op('*'),
// 			id('x') , 
// 			number(5)), 
// 		ifThenElse(bool(false), number(2), 
// 			assume(idBinds( [idASTBind(id('x'), number(6)), idASTBind(id('y'), number(7))] ), primApp(op('+'), id('x'), id('y') ) )
// 		) );

// var ast = primApp( op('+'), number(2), number(3) );

// var ast = primApp( op('+'), primApp( op('-'), number(3), number(2) ), primApp(op('*'), number(3), number(2) )  );

// var ast = primApp( op('+'), id('x'), ifThenElse( bool(false), number(4), number(3) ) );

// var ast = primApp( op('+'), id('x'), ifThenElse( bool(false), number(4), number(3) ) );

var ast = assume( idBinds( [idASTBind(id('x'), number(6)), idASTBind(id('y'), number(7))] ), 
	primApp( op('+'), id('x'), id('y') ) );

var env = {x: 3};
evalAst(ast, env);

drawAST(ast);
