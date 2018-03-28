PQ = {

	q : [],

	size : function(){
		return this.q.length;
	},

	pop : function(){
		e = this.q[0];
		i = 0;
		this.q.forEach(function(item,index,array){
			if(item[1] < e[1]){
				e = item;
				i = index;
			}
		});
		this.q.splice(i,1);
		return e;
	},

	push : function(e, p){
		this.q.push([e,p])
	},
}

/////
var m = [];
var origin = [0,0];
var goal = [9,9];

function buildMatrix(){
	for(i=0; i<10; i++){
		m[i] = [];
		for(j=0; j<10; j++){
			m[i][j] = 0;
		}
	}
}

function printMatrix(){
	canvas = document.getElementById("canvas");
	canvas.innerText = "";
	canvas.innerHtml = "";

	//Horizontal guide
	canvas.innerText += "\xa0\xa0\xa0\xa0"
	for(i = 0; i<10; i++){
		canvas.innerText += "\xa0\xa0\xa0\xa0"+i
	}

	canvas.appendChild(document.createElement('br'));

	canvas.innerText += "\xa0\xa0\xa0\xa0"
	for(i = 0; i<10; i++){
		canvas.innerText += "\xa0\xa0\xa0\xa0_"
	}

	canvas.appendChild(document.createElement('br'));

	
	for(i=0; i<10; i++){
		//Vertical guide
		canvas.innerText += i+" | "
		for(j=0; j<10; j++){
			canvas.innerText += "\xa0\xa0\xa0\xa0"+m[i][j];
		}
		canvas.appendChild(document.createElement('br'));
	}		
}

function isEqual(a,b){
	if(a[0][0] == b[0] && a[0][1] == b[1]){
		return true;
	}
	return false;
}

function getNeighbors(elem){
	el = elem[0]
	neighbors = []
	//top
	if(m[el[0]] !== undefined && m[el[0]][el[1]-1] !== undefined){
		neighbors.push([el[0],el[1]-1])
	}
	//bottom
	if(m[el[0]] !== undefined && m[el[0]][el[1]+1] !== undefined){
		neighbors.push([el[0],el[1]+1])
	}
	//right
	if(m[el[0]+1] !== undefined && m[el[0]+1][el[1]] !== undefined){
		neighbors.push([el[0]+1,el[1]])
	}
	//left
	if(m[el[0]-1] !== undefined && m[el[0]-1][el[1]] !== undefined){
		neighbors.push([el[0]-1,el[1]])
	}
	//upper right diagonal
	if(m[el[0]+1] !== undefined && m[el[0]+1][el[1]+1] !== undefined){
		neighbors.push([el[0]+1,el[1]+1])
	}
	//upper left diagonal
	if(m[el[0]-1] !== undefined && m[el[0]-1][el[1]+1] !== undefined){
		neighbors.push([el[0]-1,el[1]+1])
	}
	//bottom right diagonal
	if(m[el[0]+1] !== undefined && m[el[0]+1][el[1]-1] !== undefined){
		neighbors.push([el[0]-1,el[1]-1])
	}
	//bottom left diagonal
	if(m[el[0]-1] !== undefined && m[el[0]-1][el[1]-1] !== undefined){
		neighbors.push([el[0]-1,el[1]-1])
	}

	return neighbors;
}

function heuristic(goal, next){
	return Math.sqrt(Math.pow((goal[0]-next[0]),2) + Math.pow((goal[1]-next[1]),2))
}

function astar(){
	frontier = PQ
	frontier.push(origin,0)
	came_from = []
	cost_so_far = []
	came_from[origin] = null
	cost_so_far[origin] = 0

	while(frontier.size() > 0){
		current = frontier.pop();
		
		if(isEqual(current,goal)){
			break
		}


		d = Number.MAX_SAFE_INTEGER
		neighbors = getNeighbors(current);
		neighbors.forEach(function(next,index,array){
			new_cost = 1;
			priority = new_cost + heuristic(goal, next)
			if(priority < d){
				d = priority
				cost_so_far[next] = new_cost				
				frontier.push(next, priority)
				came_from[next] = current
			}
		});
	}

	return came_from;
}

function findPath(path){
	for(key in path){
		x1 = key[0]
		y1 = key[2]
		x2 = path[key][0][0]
		y2 = path[key][0][2]
		
		m[x1][y1] = "x"
		m[x2][y2] = "x"
		printMatrix()
	}
}

function optimizePath(path){
	optimizedPath = []
	for(key in path){
		
		if(key == "0,0"){
			continue
		}

		index = path[key][0]
		priority = path[key][1]
		
		if(optimizedPath[index] === undefined){
			optimizedPath[index] = [key, priority]
		}else if(optimizedPath[index][1] > priority){
			optimizedPath[index] = [key, priority]
		}
	}
	return optimizedPath
}

buildMatrix();
printMatrix();
path = astar();
path = optimizePath(path);
findPath(path);