
evalAst = function(ast, env){

	var eval = undefined;
	var info = ast.info;

	switch(ast.type){
		case 'op':
			eval = info.op;
			break;
		case 'id':
			eval = lookup(env, info.id);
			break;
		case 'number':
			eval = info.number;
			break;
		case 'bool':
			eval = info.bool;
			break;
		case 'prim-app':
			eval = evalPrimApp(info, env);
			break;
		case 'if-then-else':
			eval = evalIfThenElse(info, env);
			break;
		case 'assume':
			eval = evalAssume(info, env);
			break;
		default:
			eval = null;
			break;
	};

	ast.eval = eval;
	ast.env = env;
	return eval;
};

evalPrimApp = function(ast, env){

	var oper = evalAst(ast.operator, env);
	var res1 = evalAst(ast.ast1, env);
	var res2 = evalAst(ast.ast2, env);

	switch(oper){
		case '+':
			return res1 + res2;
		case '-':
			return res1 - res2;
		case '*':
			return res1 * res2;
		case '/':
			return res1 / res2;
		case '<':
			return res1 < res2;
		case '<=':
			return res1 <= res2;
		case '>':
			return res1 > res2;
		case '>=':
			return res1 >= res2;
	};
};

evalIfThenElse = function(ast, env){

	var testValue = evalAst(ast.ifAst, env);
	if (testValue){
		ast.elseAst.eval = "NE!";
		return evalAst(ast.thenAst, env);
	}
	else{
		ast.thenAst.eval = "NE!";
		return evalAst(ast.elseAst, env);
	}
};

evalAssume = function(ast, env){

	var extEnv = extendEnv(env, ast.idBinds);
	return evalAst(ast.body, extEnv);
};

evalIdAstBind = function(idAstBind, env){

	var val = evalAst(idAstBind.ast, env);
	idAstBind.id.eval = val;
	return {
		id: idAstBind.id.label,
		val: val
	};
};

extendEnv = function(env, idBinds){

	var binds = idBinds.info.binds;

	var newEnv = {};
	binds.forEach(function(bind){
		var res = evalIdAstBind(bind.info, env);
		bind.env = {};
		bind.env[res.id] = res.val;
		newEnv[res.id] = res.val;
	});

	for(key in env){
		if( !(key in newEnv) )
			newEnv[key] = env[key];
	}

	idBinds.env = newEnv;
	return newEnv;
};

lookup = function(env, id){
	return env[id];
};
