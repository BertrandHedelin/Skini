import processing.opengl.*;

void setup()
{
    size(450, 450, OPENGL);
    
}

void draw()
{
    background(0, 128, 255);
    lights();
    
    fill(255, 128, 0);

    pushMatrix();    
    translate( 120, 120, 0 );
    rotateX( PI/6 );
    rotateY( radians( frameCount ) );
    rotateZ( radians( frameCount ) );
    drawCylinder( 6,  50, 100 );
    popMatrix();

    pushMatrix();    
    translate( 330, 120, 0 );
    rotateX( PI/4 );
    rotateY( radians( frameCount ) );
    rotateZ( radians( frameCount ) );
    drawCylinder( 9,  40, 100 );
    popMatrix();

    pushMatrix();    
    translate( 120, 330, 0 );
    rotateX( PI/2 );
    rotateY( radians( frameCount ) );
    rotateZ( radians( frameCount ) );
    drawCylinder( 30, 50, 100 );
    popMatrix();

    pushMatrix();    
    translate( 330, 330, 0 );
    rotateX( PI/12 );
    rotateY( radians( frameCount ) );
    rotateZ( radians( frameCount ) );
    drawCylinder( 8, 50, 100 );
    popMatrix();
}

void drawCylinder( int sides, float r, float h)
{
    float angle = 360 / sides;
    float halfHeight = h / 2;

    // draw top of the tube
    beginShape();
    for (int i = 0; i < sides; i++) {
        float x = cos( radians( i * angle ) ) * r;
        float y = sin( radians( i * angle ) ) * r;
        vertex( x, y, -halfHeight);
    }
    endShape(CLOSE);

    // draw bottom of the tube
    beginShape();
    for (int i = 0; i < sides; i++) {
        float x = cos( radians( i * angle ) ) * r;
        float y = sin( radians( i * angle ) ) * r;
        vertex( x, y, halfHeight);
    }
    endShape(CLOSE);
    
    // draw sides
    beginShape(TRIANGLE_STRIP);
    for (int i = 0; i < sides + 1; i++) {
        float x = cos( radians( i * angle ) ) * r;
        float y = sin( radians( i * angle ) ) * r;
        vertex( x, y, halfHeight);
        vertex( x, y, -halfHeight);    
    }
    endShape(CLOSE);

}
