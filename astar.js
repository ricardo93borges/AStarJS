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
var walls = [
	[[0,3],[1,3],[2,3],[3,3],[4,3],[5,3]],
	[[9,7],[8,7],[7,7],[6,7],[5,7],[4,7],[3,7]]
]

function buildMatrix(){
	for(i=0; i<10; i++){
		m[i] = [];
		for(j=0; j<10; j++){
			m[i][j] = 0;
		}
	}

	for(j=0; j<walls.length; j++){
		for(i=0; i<walls[j].length; i++){
			x = walls[j][i][0]
			y = walls[j][i][1] 
			m[x][y] = "w"
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
		x = el[0]
		y = el[1]-1
		if(m[x][y] != "w"){
			neighbors.push([x,y])
		}
	}
	//bottom
	if(m[el[0]] !== undefined && m[el[0]][el[1]+1] !== undefined){
		x = el[0]
		y = el[1]+1
		if(m[x][y] != "w"){
			neighbors.push([x,y])
		}
	}
	//right
	if(m[el[0]+1] !== undefined && m[el[0]+1][el[1]] !== undefined){
		x = el[0]+1
		y = el[1]
		if(m[x][y] != "w"){
			neighbors.push([x,y])
		}
	}
	//left
	if(m[el[0]-1] !== undefined && m[el[0]-1][el[1]] !== undefined){
		x = el[0]-1
		y = el[1]
		if(m[x][y] != "w"){
			neighbors.push([x,y])
		}
	}
	//upper right diagonal
	if(m[el[0]+1] !== undefined && m[el[0]+1][el[1]+1] !== undefined){
		x = el[0]+1
		y = el[1]+1
		if(m[x][y] != "w"){
			neighbors.push([x,y])
		}
	}
	//upper left diagonal
	if(m[el[0]-1] !== undefined && m[el[0]-1][el[1]+1] !== undefined){
		x = el[0]-1
		y = el[1]+1
		if(m[x][y] != "w"){
			neighbors.push([x,y])
		}
	}
	//bottom right diagonal
	if(m[el[0]+1] !== undefined && m[el[0]+1][el[1]-1] !== undefined){
		x = el[0]+1
		y = el[1]-1
		if(m[x][y] != "w"){
			neighbors.push([x,y])
		}
	}
	//bottom left diagonal
	if(m[el[0]-1] !== undefined && m[el[0]-1][el[1]-1] !== undefined){
		x = el[0]-1
		y = el[1]-1
		if(m[x][y] != "w"){
			neighbors.push([x,y])
		}
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
			if(cost_so_far[next] === undefined && priority < d){
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
	p = [];
	came_from = path[goal];
	p.push(came_from[0])

	while(came_from !== null){
		came_from = path[came_from[0]]	
		if(came_from !== null){
			p.push(came_from[0])
		}
	}

	return p;
}

function drawPath(path){
	for(z=path.length-1; z>=0; z--){
		x = path[z][0]
		y = path[z][1]
		
		m[x][y] = "x"
		printMatrix()
	}
}

buildMatrix();
printMatrix();
path = astar();
path = findPath(path);
drawPath(path)