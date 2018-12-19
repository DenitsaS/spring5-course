if (typeof THREE == 'undefined' && typeof require != 'undefined')
    var THREE = require('three');

if (typeof ThreeBSP == 'undefined' && typeof require != 'undefined')
    var ThreeBSP = require('three-js-csg/index')(THREE);

if (typeof DxfParser == 'undefined' && typeof require != 'undefined')
    var DxfParser = require('dxf-parser');

if (typeof inside == 'undefined' && typeof require != 'undefined')
    var inside = require('point-in-polygon');

if (typeof earcut == 'undefined' && typeof require != 'undefined')
    var earcut = require('earcut');

const TYPES = {
    POLYGON: "POLYGON",
    CILINDER: "CILINDER"
}
/**
 * Returns the angle in radians of the vector (p1,p2). In other words, imagine
 * putting the base of the vector at coordinates (0,0) and finding the angle
 * from vector (1,0) to (p1,p2).
 * @param  {Object} p1 start point of the vector
 * @param  {Object} p2 end point of the vector
 * @return {Number} the angle
 */

function addContour(vertices, contour) {
    for (var i = 0; i < contour.length; i++) {
        vertices.push(contour[i].x);
        vertices.push(contour[i].y);
    }
}

THREE.ShapeUtils.triangulateShape = function (contour, holes) {
    var vertices = [];

    addContour(vertices, contour);

    var holeIndices = [];
    var holeIndex = contour.length;

    for (i = 0; i < holes.length; i++) {
        holeIndices.push(holeIndex);
        holeIndex += holes[i].length;
        addContour(vertices, holes[i]);
    }
    try {
        var result = earcut(vertices, holeIndices, 2);
    } catch (e) {
        console.error(e);
    }

    var grouped = [];
    for (var i = 0; i < result.length; i += 3) {
        grouped.push(result.slice(i, i + 3));
    }
    return grouped;
};

const LAYERS = {
    Layer1: {
        zBottom: 0,
        zTop: 47.4
    },
    Layer2: {
        zBottom: 98.1,
        zTop: 132.5
    },
    Layer3: {
        zBottom: 333,
        zTop: 348
    },
    Layer4: {
        zBottom: 578.6,
        zTop: 592.1
    },
    Layer5: {
        zBottom: 795.2,
        zTop: 847.6
    }
}

const VIAS = {
    Via1: {
        outsideRadiusBottom: 39.5,
        outsideRadiusTop: 35.5,
        outsideZBottom: 0,
        outsideZTop: 132.5,
        insideRadiusBottom: 1,
        insideRadiusTop: 1,
        insideZBottom: 1,
        insideZTop: 1
    },
    Via2: {
        outsideRadiusBottom: 95.5,
        outsideRadiusTop: 95.5,
        outsideZBottom: 98.1,
        outsideZTop: 847.6,
        insideRadiusBottom: 40.5,
        insideRadiusTop: 40.5,
        insideZBottom: 132.5,
        insideZTop: 795.2
    },
    Via3: {
        outsideRadiusBottom: 238.5,
        outsideRadiusTop: 238.5,
        outsideZBottom: 0,
        outsideZTop: 847.6,
        insideRadiusBottom: 176,
        insideRadiusTop: 176,
        insideZBottom: 0,
        insideZTop: 847.6
    },
    Via4: {
        outsideRadiusBottom: 1250,
        outsideRadiusTop: 1250,
        outsideZBottom: 0,
        outsideZTop: 847.6,
        insideRadiusBottom: 1211.5,
        insideRadiusTop: 1211.5,
        insideZBottom: 0,
        insideZTop: 847.6
    }
}

const COLORS = {
    Layer1: 0xac1840,
    Layer2: 0x334251,
    Layer3: 0x2DB394,
    Layer4: 0x3B78B4,
    Layer5: 0x334251,
    Via1: 0x334251,
    Via2: 0x08F9E9,
    Via3: 0x2DB394,
    Via4: 0x3B78B4,
}
const EXTRUDE_SETTINGS = {

    steps: 1,
    depth: 0,
    bevelEnabled: false,
};

THREE.Math.angle2 = function (p1, p2) {
    var v1 = new THREE.Vector2(p1.x, p1.y);
    var v2 = new THREE.Vector2(p2.x, p2.y);
    v2.sub(v1); // sets v2 to be our chord
    v2.normalize();
    if (v2.y < 0) return -Math.acos(v2.x);
    return Math.acos(v2.x);
};


THREE.Math.polar = function (point, distance, angle) {
    var result = {};
    result.x = point.x + distance * Math.cos(angle);
    result.y = point.y + distance * Math.sin(angle);
    return result;
};

/**
 * Calculates points for a curve between two points
 * @param startPoint - the starting point of the curve
 * @param endPoint - the ending point of the curve
 * @param bulge - a value indicdrawLayerating how much to curve
 * @param segments - number of drawLayersegments between the two given points
 */
THREE.BulgeGeometry = function drawLayer(startPoint, endPoint, bulge, segments) {
    var vertex, i,
        center, p0, p1, angle,
        radius, startAngle,
        thetaAngle;

    THREE.Geometry.call(this);

    this.startPoint = p0 = startPoint ? new THREE.Vector2(startPoint.x, startPoint.y) : new THREE.Vector2(0, 0);
    this.endPoint = p1 = endPoint ? new THREE.Vector2(endPoint.x, endPoint.y) : new THREE.Vector2(1, 0);
    this.bulge = bulge = bulge || 1;

    angle = 4 * Math.atan(bulge);
    radius = p0.distanceTo(p1) / 2 / Math.sin(angle / 2);
    center = THREE.Math.polar(startPoint, radius, THREE.Math.angle2(p0, p1) + (Math.PI / 2 - angle / 2));

    this.segments = segments = segments || Math.max(Math.abs(Math.ceil(angle / (Math.PI / 18))), 6); // By default want a segment roughly every 10 degrees
    startAngle = THREE.Math.angle2(center, p0);
    thetaAngle = angle / segments;


    this.vertices.push(new THREE.Vector3(p0.x, p0.y, 0));

    for (i = 1; i <= segments - 1; i++) {

        vertex = THREE.Math.polar(center, Math.abs(radius), startAngle + thetaAngle * i);

        this.vertices.push(new THREE.Vector3(vertex.x, vertex.y, 0));
    }

};

THREE.BulgeGeometry.prototype = Object.create(THREE.Geometry.prototype);


THREE.DXFLoader = function (manager) {

    this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
};

THREE.DXFLoader.prototype = {

    constructor: THREE.DXFLoader,

    load: function (url, onLoad, onProgress, onError) {

        var scope = this;

        var loader = new THREE.FileLoader(this.manager);
        loader.load(url, function (text) {
            onLoad(scope.parse(new DxfParser().parseSync(text)));
        }, onProgress, onError);

    },

    parse: function (data) {
        var check = null;
        const group = new THREE.Object3D();
        const HOLES_BY_LAYER = getHolesByLayerDictionary(data);
        const GEOMETRYES_BY_LAYER = new Map();
        data.entities.forEach(entity => {
            var obj = drawSolidFrom2D(entity, data);
            if (obj && obj.type == TYPES.POLYGON) {
                var singleGeometry = GEOMETRYES_BY_LAYER.get(obj.layer);
                if (singleGeometry) {
                    var geometry = new THREE.ExtrudeGeometry(obj.shape, { steps: 1, bevelEnabled: false, depth: LAYERS[obj.layer].zTop - LAYERS[obj.layer].zBottom });
                    singleGeometry.merge(geometry);
                } else {
                    var geometry = new THREE.ExtrudeGeometry(obj.shape, { steps: 1, bevelEnabled: false, depth: LAYERS[obj.layer].zTop - LAYERS[obj.layer].zBottom });
                    singleGeometry = new THREE.Geometry();
                    singleGeometry.merge(geometry);
                    singleGeometry.name = obj.layer;
                    GEOMETRYES_BY_LAYER.set(obj.layer, singleGeometry);
                }
            }
            if (obj && obj.type == TYPES.CILINDER) {
                group.add(obj.mesh)
            }
        })

        Array.from(GEOMETRYES_BY_LAYER.values()).forEach(geometry => {
            var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS[geometry.name], transparent: true, opacity: 1 }))
            mesh.position.z = LAYERS[geometry.name].zBottom;
            group.add(mesh)
        })
        return group;

        function drawSolidFrom2D(entity, data) {
            if (entity.type === 'CIRCLE') {
                return drawCilinder(entity, data);
            } else if (entity.type === 'LWPOLYLINE' || entity.type === 'LINE' || entity.type === 'POLYLINE') {
                return drawPolygon(entity, data);
            }
        }

        function drawPolygon(entity, data) {
            let polygon = getPolygonFromVerteces(entity.vertices), holes = HOLES_BY_LAYER.get(entity.layer);
            if (holes) {
                var shape = new THREE.Shape(entity.vertices);
                holes.forEach(hole => {
                    if (entity.layer == "Layer2" || entity.layer == "Layer3" || entity.layer == "Layer4") {
                        if (hole.r > 100) {
                            setHole(shape, hole, polygon);
                        }
                    } else {
                        setHole(shape, hole, polygon);
                    }
                })
                return {
                    type: TYPES.POLYGON,
                    layer: entity.layer,
                    shape: shape
                }
            }
        }

        function drawCilinder(entity, data) {
            const layerDimensions = VIAS[entity.layer];
            if (layerDimensions) {
                const args = {
                    outsideRadiusBottom: layerDimensions.outsideRadiusBottom,
                    outsideRadiusTop: layerDimensions.outsideRadiusTop,
                    outsideHeight: layerDimensions.outsideZTop - layerDimensions.outsideZBottom,

                    insideRadiusBottom: layerDimensions.insideRadiusBottom,
                    insideRadiusTop: layerDimensions.insideRadiusTop,
                    insideHeight: layerDimensions.insideZTop - layerDimensions.insideZBottom,

                    radiusSegments: 32, heightSegments: 4, openEnded: false,
                    rotationX: 90, rotationY: 0, rotationZ: 0,

                    x: entity.center.x, y: entity.center.y, z: layerDimensions.outsideZBottom,
                    s: 1, p: 1,

                    color: COLORS[entity.layer] ? COLORS[entity.layer] : getColor(entity, data)
                }
                return cilinder(args);
            }
        }
        function cilinder(args) {
            var largeCylinderGeom = getCilinderGeometry(args.outsideRadiusTop, args.outsideRadiusBottom, args.outsideHeight, args.radiusSegments);
            var smallCylinderGeom = getCilinderGeometry(args.insideRadiusTop, args.insideRadiusBottom, args.insideHeight, args.radiusSegments);

            var smallCylinderBSP = new ThreeBSP(smallCylinderGeom);
            var largeCylinderBSP = new ThreeBSP(largeCylinderGeom);
            var intersectionBSP = largeCylinderBSP.subtract(smallCylinderBSP);

            var redMaterial = new THREE.MeshBasicMaterial({ color: args.color, transparent: true, opacity: args.p });
            var geometry = intersectionBSP.toGeometry();
            geometry.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(args.x, args.y, args.z)));

            return { type: TYPES.CILINDER, mesh: new THREE.Mesh(geometry, redMaterial) }
        }

        function getPointsInsidePolygon(vertices, polygon) {
            var vectors = []
            for (let i = 0; i < vertices.length - 1; i++) {
                if (inside(Object.values(vertices[i]), polygon)) {
                    vectors.push(vertices[i])
                }
            }
            return vectors;
        }
        function getPolygonFromVerteces(vertices) {
            let polygon = [];
            vertices.forEach(vert => {
                polygon.push(Object.values(vert))
            });
            return polygon;
        }
        function getCilinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded) {
            let geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, 180);
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, height / 2, 0));
            geometry.rotateX((90 * Math.PI) / 180);
            return geometry
        }
        function setHole(shape, hole, polygon) {
            let circlePath = new THREE.Path();
            circlePath.absarc(hole.x, hole.y, hole.r, 0, 0, true);
            let polyPoints = getPointsInsidePolygon(circlePath.getPoints(), polygon);
            if (polyPoints.length > 2) {
                let path = new THREE.Path();
                path.setFromPoints(polyPoints);
                shape.holes.push(path);
            }
        }
        function getColor(entity, data) {
            var color = 0x000000; //default
            if (entity.color) color = entity.color;
            else if (data.tables && data.tables.layer && data.tables.layer.layers[entity.layer])
                color = data.tables.layer.layers[entity.layer].color;
            if (color == null || color === 0xffffff) {
                color = 0x000000;
            }
            return color;
        }

        function getHolesByLayerDictionary(data) {
            let HOLES_BY_LAYER = new Map();

            data.entities.forEach(entity => {
                if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
                    let viaDimensions = VIAS[entity.layer]
                    if (viaDimensions) {
                        let layerKeys = Object.keys(LAYERS);
                        for (let i = 0; i < layerKeys.length; i++) {
                            if (viaDimensions.outsideZBottom == LAYERS[layerKeys[i]].zBottom) {
                                let holes = HOLES_BY_LAYER.get(layerKeys[i]);
                                if (holes) {
                                    holes.push({
                                        x: entity.center.x,
                                        y: entity.center.y,
                                        z: viaDimensions.outsideZBottom,
                                        r: viaDimensions.outsideRadiusTop,
                                        h: viaDimensions.outsideZTop - viaDimensions.outsideZBottom
                                    })
                                    HOLES_BY_LAYER.set(layerKeys[i], holes);
                                } else {
                                    holes = []
                                    holes.push({
                                        x: entity.center.x,
                                        y: entity.center.y,
                                        z: viaDimensions.outsideZBottom,
                                        r: viaDimensions.outsideRadiusTop,
                                        h: viaDimensions.outsideZTop - viaDimensions.outsideZBottom
                                    })
                                    HOLES_BY_LAYER.set(layerKeys[i], holes);
                                }
                                continue;
                            }
                            if (viaDimensions.outsideZBottom < LAYERS[layerKeys[i]].zBottom && (viaDimensions.outsideZTop >= LAYERS[layerKeys[i]].zTop)) {
                                let holes = HOLES_BY_LAYER.get(layerKeys[i]);
                                if (holes) {
                                    holes.push({
                                        x: entity.center.x,
                                        y: entity.center.y,
                                        z: viaDimensions.outsideZBottom,
                                        r: viaDimensions.outsideRadiusTop,
                                        h: viaDimensions.outsideZTop - viaDimensions.outsideZBottom
                                    })
                                    HOLES_BY_LAYER.set(layerKeys[i], holes);
                                } else {
                                    holes = []
                                    holes.push({
                                        x: entity.center.x,
                                        y: entity.center.y,
                                        z: viaDimensions.outsideZBottom,
                                        r: viaDimensions.outsideRadiusTop,
                                        h: viaDimensions.outsideZTop - viaDimensions.outsideZBottom
                                    })
                                    HOLES_BY_LAYER.set(layerKeys[i], holes);
                                }
                            }
                        }
                    }
                }
            })
            return HOLES_BY_LAYER;
        }
    }
};