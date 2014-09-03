cb.Collision = {};

cb.Polygon = cc.Class.extend({
    _vertices : null,

    ctor:function(vertices) {
        this._vertices = [].concat(vertices);
    },

    translate:function(vector) {
        var translatedVertices = [];
        $.each(this._vertices, function(index, vertex) {
            translatedVertices.push(cc.p(vertex.x + vector.x, vertex.y + vector.y));
        });

        return new cb.Polygon(translatedVertices);
    },

    rotate:function(angle, pivot) {
        var rotatedVertices = [];
        $.each(this._vertices, function(index, vertex) {
            rotatedVertices.push(cb.Collision.rotatePoint(vertex, angle, pivot))
        });

        return new cb.Polygon(rotatedVertices);
    },

    toArray:function() {
        return this._vertices.slice(0);
    }
});

cb.Polygon.create = function(vertices) {
    return new cb.Polygon(vertices);
};

cb.Polygon.createFromCCRect = function(rect) {
    var vertices = [];
    var multipliers = [ [0, 0], [0, 1], [1, 1], [1, 0] ];

    for (var i = 0; i < 4; i++)
        vertices.push(cc.p(rect.x + rect.width * multipliers[i][0],
                           rect.y + rect.height * multipliers[i][1]));

    return new cb.Polygon(vertices);
};

cb.Collision.checkObstaclePlayerCollide = function(obstacle, player) {
    var obstaclePolygons = obstacle.getPolygonsForHitTest();
    var playerPolygons = player.getPolygonsForHitTest();

    for (var i = 0; i < obstaclePolygons.length; i++)
        for (var j = 0; j < playerPolygons.length; j++) {
            var obstaclePolygon = cb.Collision.converToWorldPolygon(obstaclePolygons[i], obstacle);
            var playerPolygon = cb.Collision.converToWorldPolygon(playerPolygons[j], player);
            if (cb.Collision.checkPolygonsIntersect(obstaclePolygon.toArray(), playerPolygon.toArray()))
                return true;
        }

    return false;
};

cb.Collision.converToWorldPolygon = function(polygon, object) {
    var worldSpacePosition = object.getParent().convertToWorldSpace(object.getPosition());
    return polygon.translate(worldSpacePosition);
};

cb.Collision.rotatePoint = function(point, degreeAngle, pivot) {
    var radianAngle = degreeAngle / 180 * Math.PI;
    var sin = Math.sin(radianAngle), cos = Math.cos(radianAngle);

    var ret = cc.p(point.x, point.y);

    // Linear translation from origin to pivot
    ret.x -= pivot.x;
    ret.y -= pivot.y;

    var x = ret.x * cos - ret.y * sin;
    var y = ret.x * sin + ret.y * cos;

    ret.x = x;
    ret.y = y;

    // Linear translation back from pivot to origin
    ret.x += pivot.x;
    ret.y += pivot.y;

    return ret;
};

// using bounding box, only works for convex polygons
// source: https://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
cb.Collision.checkPolygonsIntersect = function(a, b) {
    function isUndefined(obj) {
        return obj === undefined;
    }

    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
};