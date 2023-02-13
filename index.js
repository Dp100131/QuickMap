import Graph from "./JS/GrafoPOO/Graph.js"
import GraphEdge from "./JS/GrafoPOO/GraphEdge.js"
import GraphVertex from "./JS/GrafoPOO/GraphVertex.js"
import bfTravellingSalesman from "./JS/GrafoPOO/TSP.js"
import {nodos} from './JS/Data/nodos.js'
import {edges} from './JS/Data/edges.js'

/**
 * Agregamos todas las opciones de tiendas.
 */
const checkContainer = document.getElementById("check-Container")
let idCheckHTML = 1
var GRAPH = new Graph()

nodos.forEach(element => {


    GRAPH.addVertex(new GraphVertex(element.id, element.name, element.lat, element.lng))

	if(element.id != 0){

		let nameReplaced = element.name.replaceAll("_", " ")
		
		let newCheck = `<div class="checkItem">
          
			<input type="checkbox" class="input-check" id="cbox${idCheckHTML}" value="${element.id}"><label class="label-check" for="cbox${idCheckHTML}" >${nameReplaced}</label>

		</div>`

		checkContainer.innerHTML += newCheck

		idCheckHTML++

	}

});

edges.forEach(element => {

	let startVertex = GRAPH.getVertexByKey((element.sourceNode).toString())
	let endVertex = GRAPH.getVertexByKey((element.destinationNode).toString())

    GRAPH.addEdge(new GraphEdge(startVertex, endVertex, element.weight))

})

let map
var directionsService
var directionsRenderer

//Funciones

    //Inicializar mapa

const TOLUCOORDS = {lat: 9.527176353616802, lng: -75.58075790869917}

const MAPDIV = document.getElementById("map")

function initMap() {

    directionsService = new google.maps.DirectionsService()
    directionsRenderer = new google.maps.DirectionsRenderer()

    map = new google.maps.Map(MAPDIV, {
      center: TOLUCOORDS,
      zoom: 15,
    });

	directionsRenderer.setMap(map)

	document.getElementById("submit").addEventListener("click", () => {

		calculateAndDisplayRoute(directionsService, directionsRenderer);

	})
    
}

const cbox1 = document.getElementById("cbox1")
const cbox2 = document.getElementById("cbox2")
const cbox3 = document.getElementById("cbox3")
const cbox4 = document.getElementById("cbox4")
const cbox5 = document.getElementById("cbox5")
const cbox6 = document.getElementById("cbox6")
const cbox7 = document.getElementById("cbox7")

let checkBoxVector = [cbox1, cbox2, cbox3, cbox4, cbox5, cbox6, cbox7]

function calculateAndDisplayRoute(directionsService, directionsRenderer) {

	let graphRuta = new Graph()

	if((!cbox1.checked) && (!cbox2.checked) && (!cbox3.checked) && (!cbox4.checked) && (!cbox5.checked) && (!cbox6.checked) && (!cbox7.checked)){

		alert("Debes seleccionar algún checkBox.")

	} else {

		

		graphRuta.addVertex(new GraphVertex(GRAPH.vertices[0].id, GRAPH.vertices[0].name, GRAPH.vertices[0].lat, GRAPH.vertices[0].lng))

		checkBoxVector.forEach(element => {

			if(element.checked){

				GRAPH.getAllVertices().forEach(generalElement => {

					if(generalElement.id == element.value){

						graphRuta.addVertex(new GraphVertex(generalElement.id, generalElement.name, generalElement.lat, generalElement.lng))

					}
					
				});

			}
			
		});

		console.log(graphRuta.getAllVertices().length)

		if(graphRuta.getAllVertices().length == 2)
		{

			let todos = graphRuta.getAllVertices()


			let primero = new google.maps.LatLng(todos[0].lat, todos[0].lng)
			let segundo = new google.maps.LatLng(todos[1].lat, todos[1].lng)

			var request ={
				origin: primero,
				destination: segundo,
				travelMode: 'DRIVING'
			}


			directionsService.route(request, function(result, status){

				if(status == 'OK'){

					directionsRenderer.setDirections(result)

				}

			})

		}else{

			let nodosUltGraph = []

			nodosUltGraph.push(new GraphVertex(nodos[0].id, nodos[0].name, nodos[0].lat, nodos[0].lng))

			checkBoxVector.forEach(element => {

				if(element.checked){

					nodos.forEach(elementNodo => {

						if (element.value == elementNodo.id) {

							nodosUltGraph.push(new GraphVertex(elementNodo.id, elementNodo.name, elementNodo.lat, elementNodo.lng))
						
						}
						
					});
	
				}
				
			});

			const ultGraph = new Graph();

			edges.forEach(element => {
	
				nodosUltGraph.forEach(v1 => {
			
			
					nodosUltGraph.forEach(v2 => {
			
						if ((v1.id == element.sourceNode) && (v2.id == element.destinationNode)) {
							
							ultGraph.addEdge(new GraphEdge(v1, v2, element.weight))
			
						}
						
					});
					
				});
			
			});

			let nodosYPeso = bfTravellingSalesman(ultGraph)

			console.log(nodosYPeso)
	
			const waypts = []
	
			nodosYPeso.forEach(element => {
				
				waypts.push({
	
					location: new google.maps.LatLng(element.lat, element.lng),
					stopover: true
	
				})
	
			});
	
			directionsService.route({
	
				origin: new google.maps.LatLng(nodosYPeso[0].lat, nodosYPeso[0].lng),
				destination: new google.maps.LatLng(nodosYPeso[(nodosYPeso.length) - 1].lat, nodosYPeso[(nodosYPeso.length) - 1].lng),
				waypoints: waypts,
				travelMode: google.maps.TravelMode.DRIVING,
	
			})
				.then((response) => {

					directionsRenderer.setDirections(response)
	
				})
				.catch((e) => window.alert("Directions request failed due to " + e));

		}

		

	}
	
}

window.initMap = initMap;