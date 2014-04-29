import java.awt.*;
import java.awt.image.*;
import java.applet.AudioClip;

public final class puzz extends java.applet.Applet implements Runnable
{
	int i,j,k,l,li;
	int downX,downY,slidePiece,slideH,slideV,displace,dragging=0;
	int seed=1,counter=0,goalsDone;
	int shades[]={0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0};
	int shadows[]={0,0,0,2,0,4,1,3};
	int autoDisplace[]={0,5,12,21,32,32,27,20,11,0};
	int subgoals[]={1,0,2,0,3,4,0,5,0,6,0,7,8,0,9,13,0,10,14,0,11,12,15,0,16};
	int detour1[]={11,10,6,7,11,10,6,7,3,2,6,7,11,-1};
	int detour2[]={15,14,10,11,15,14,10,11,7,6,10,11,15,-1};
	int detour3[]={6,2,3,7,-1},detour4[]={3,7,-1};
	int detour5[]={10,6,7,11,-1},detour6[]={7,11,-1};
	int detour7[]={13,12,8,9,-1},detour8[]={8,9,-1};
	int detour9[]={10,14,13,9,10,14,13,9,8,12,13,9,10,-1};
	int detour10[]={14,13,9,10,-1},detour11[]={9,10,-1};
	int detour12[]={11,15,14,10,11,15,14,10,9,13,14,10,11,-1};
	int roundabout[]={11,10,14,15,-1};
	int roundDisp[]={-4,-3,1,5,4,3,-1,-5,-4,-3,1,5,4,3,-1,-5,-4,-3,1,5,4,3,-1,-5,-4};
	int rounddx[]={0,1,1,1,0,-1,-1,-1,0,1,1,1,0,-1,-1,-1,0,1,1,1,0,-1,-1,-1,0};
	
	int moves[]=new int[400],moveCount=0,holder[]=new int[20],current,moveNum=0;
	int map[]=new int[6*6],ppath[]=new int[9];
	boolean vertical,dragControl=true,automatic=false,oldDragControl;
	Image background,vert,hori,smalls[];
	Color backCol=Color.lightGray;
	Graphics backG,vertG,horiG;
	MediaTracker mt;
	ImageProducer improd;
	Thread life;
	long nextTime;
	AudioClip click,slide;
	
	public void init()
	{
		String s=getParameter("bgcolor"); // Get background color from parameter
		if (s!=null && s.length()==7)
		{
			int cols[]=new int[3];
			for (i=0;i<3;i++)
			{
				j=Character.toLowerCase(s.charAt(1+i*2));
				if ('0'<=j && j<='9')
					k=j-'0';
				else
					k=10+j-'a';
				j=Character.toLowerCase(s.charAt(2+i*2));
				if ('0'<=j && j<='9')
					k=16*k+(j-'0');
				else
					k=16*k+(10+j-'a');
				cols[i]=k;
			}
			backCol=new Color(cols[0],cols[1],cols[2]);
		}
		Image collection;
		mt=new MediaTracker(this);
		background=createImage(129,128);
		backG=background.getGraphics();
		vert=createImage(38,70);
		vertG=vert.getGraphics();
		hori=createImage(70,38);
		horiG=hori.getGraphics();
		
		smalls=new Image[31]; // Construct the internal graphics building blocks
		collection = getImage(getCodeBase(),"pieces.gif");
		mt.addImage(collection,0);
		showStatus("Loading image");
		try
		{
			mt.waitForID(0);
		}
			catch(InterruptedException e) {}
		improd=collection.getSource();
		for (i=0;i<2;i++)
			for (j=0;j<5;j++)
			{
				smalls[i*5+j]=createImage(new FilteredImageSource(improd,
					new CropImageFilter(16*(j%3),16*(j/3)+32*i,16,16)));
				mt.addImage(smalls[i*5+j],1);
			}
		smalls[10]=createImage(new FilteredImageSource(improd,
					new CropImageFilter(0,64,32,32)));
		smalls[11]=createImage(new FilteredImageSource(improd,
					new CropImageFilter(0,96,32,32)));
		smalls[12]=createImage(new FilteredImageSource(improd,
					new CropImageFilter(32,64,4,38)));
		smalls[13]=createImage(new FilteredImageSource(improd,
					new CropImageFilter(36,64,4,36)));
		smalls[14]=createImage(new FilteredImageSource(improd,
					new CropImageFilter(0,128,38,4)));
		smalls[15]=createImage(new FilteredImageSource(improd,
					new CropImageFilter(0,132,37,4)));
		for (i=10;i<16;i++)
			mt.addImage(smalls[i],1);
		for (i=0;i<15;i++)
		{
			smalls[16+i]=createImage(new FilteredImageSource(improd,
				new CropImageFilter(23*(i&1),136+14*(i/2),23,14)));
			mt.addImage(smalls[16+i],1);
		}
		try
		{
			mt.waitForID(1);
		}
			catch(InterruptedException e) {}
		for (i=0;i<6;i++)
		{
			map[i]=1;
			map[i*6]=1;
		}
		for (i=0;i<4;i++)
			for (j=0;j<4;j++)
				map[7+i*6+j]=(i*4+j+1)&15;
		click=getAudioClip(getCodeBase(),"click.au");
		slide=getAudioClip(getCodeBase(),"slide.au");
		buildBackground();
		showStatus("Done");
	}
	
	public void buildBackground()
	{
		backG.setColor(backCol);
		backG.fillRect(0,0,129,128);
		for (i=0;i<4;i++)
		{
			backG.drawImage(smalls[12],125,i*32,this);
			backG.drawImage(smalls[14],i*32,124,this);
		}
		for (i=0;i<5;i++)
		{
			if (map[4+6*i]>0)
				backG.drawImage(smalls[13],125,(i-1)*32,this);
			if (map[24+i]>0)
				backG.drawImage(smalls[15],(i-1)*32,124,this);
		}
		for (i=0;i<4;i++)
			for (j=0;j<4;j++)
			{
				k=0;
				if (map[i*6+j]>0)
					k+=2;
				if (map[1+i*6+j]>0)
					k+=1;
				if (map[6+i*6+j]>0)
					k+=4;
				l=shadows[k];
				k=map[7+i*6+j];
				if (k>0)
				{
					l+=5*shades[k];
					backG.drawImage(smalls[l],j*32-3,i*32-4,this);
				}
			}
		for (i=0;i<4;i++)
			for (j=0;j<4;j++)
			{
				k=map[7+i*6+j];
				if (k>0)
				{
					backG.drawImage(smalls[10+shades[k]],j*32,i*32,this);
					backG.drawImage(smalls[15+k],5+j*32,9+i*32,this);
				}
			}
	}

	public void drawVertical(int h, int v, int disp, int piece)
	{
		vertG.setColor(backCol);
		vertG.fillRect(0,0,38,70);
		// Start with support blocks and possible shunts
		if (disp>3)
			vertG.drawImage(smalls[5*shades[piece]+1],0,disp-1,this);
		else
			vertG.drawImage(smalls[5*shades[piece]+3],0,disp-1,this);
		
		if (h==3) // Right edge
		{
			vertG.drawImage(smalls[12],32,0,this);
			vertG.drawImage(smalls[12],32,35,this);
			vertG.drawImage(smalls[13],32,-29,this);
		}
		if (v==2) // Bottom edge
		{
			vertG.drawImage(smalls[14],0,63,this);
			vertG.drawImage(smalls[15],-29,63,this);
		}
		
		if (h==3) // Right edge
		{
			vertG.drawImage(smalls[13],32,3+disp,this); // Slider shadow
		}
		else
		{
			k=2;
			if (disp<8)
				k=3;
			k+=5*shades[inMap(h+1,v)];
			vertG.drawImage(smalls[k],32,-1,this);
			k=2;
			if (disp>7)
			{
				if (disp<29)
					k=3;
				else
					k=4;
			}
			k+=5*shades[inMap(h+1,v+1)];
			vertG.drawImage(smalls[k],32,31,this);
		}
		if (v==2) // Bottom edge
		{
			if (disp>28)
				vertG.drawImage(smalls[15],3+(32-disp),63,this); // Slider shadow
		}
		else
		{
			k=1;
			if (disp>28)
				k=3;
			k+=5*shades[inMap(h,v+2)];
			vertG.drawImage(smalls[k],0,63,this);
		}
		if (h<3 && v<2)
		{
			k=4;
			if (disp>28)
				k=3;
			k+=5*shades[inMap(h+1,v+2)];
			vertG.drawImage(smalls[k],32,63,this);
		}


		// Continue with main blocks
		for (i=-1;i<3;i++)
			for (j=-1;j<2;j++)
				if (inMap(h+j,v+i)>0)
					vertG.drawImage(smalls[10+shades[inMap(h+j,v+i)]],3+32*j,
						3+32*i,this);
		vertG.drawImage(smalls[10+shades[piece]],3,3+disp,this);
		vertG.drawImage(smalls[15+piece],8,12+disp,this);
	}

	public void drawHorizontal(int h, int v, int disp, int piece)
	{
		horiG.setColor(backCol);
		horiG.fillRect(0,0,70,38);
		// Start with support blocks and possible shunts
		if (disp>3)
			horiG.drawImage(smalls[5*shades[piece]+2],disp,-1,this);
		else
			horiG.drawImage(smalls[5*shades[piece]+3],disp,-1,this);

		if (h==2) // Right edge
		{
			horiG.drawImage(smalls[12],64,0,this);
			horiG.drawImage(smalls[13],64,-29,this);
		}
		if (v==3) // Bottom edge
		{
			horiG.drawImage(smalls[14],0,31,this);
			horiG.drawImage(smalls[14],35,31,this);
			horiG.drawImage(smalls[15],-29,31,this);
		}

		if (h==2) // Right edge
		{
			if (disp>28)
				horiG.drawImage(smalls[13],64,3+(32-disp),this); // Slider shadow
		}
		else
		{
			k=2;
			if (disp>28)
				k=3;
			k+=5*shades[inMap(h+2,v)];
			horiG.drawImage(smalls[k],64,-1,this);
		}
		if (v==3) // Bottom edge
		{
			horiG.drawImage(smalls[15],3+disp,31,this); // Slider shadow
		}
		else
		{
			k=1;
			if (disp<8)
				k=3;
			k+=5*shades[inMap(h,v+1)];
			horiG.drawImage(smalls[k],0,31,this);
			k=1;
			if (disp>7)
			{
				if (disp<29)
					k=3;
				else
					k=4;
			}
			k+=5*shades[inMap(h+1,v+1)];
			horiG.drawImage(smalls[k],32,31,this);
		}
		if (h<2 && v<3)
		{
			k=4;
			if (disp>28)
				k=3;
			k+=5*shades[inMap(h+2,v+1)];
			horiG.drawImage(smalls[k],64,31,this);
		}

		// Continue with main blocks
		for (i=-1;i<2;i++)
			for (j=-1;j<3;j++)
				if (inMap(h+j,v+i)>0)
					horiG.drawImage(smalls[10+shades[inMap(h+j,v+i)]],3+32*j,
						3+32*i,this);
		horiG.drawImage(smalls[10+shades[piece]],3+disp,3,this);
		horiG.drawImage(smalls[15+piece],8+disp,12,this);
	}

	public int inMap(int h, int v)
	{
		return map[7+h+6*v];
	}
	
	public boolean mouseDown(java.awt.Event e,int x, int y)
	{
	  requestFocus();
		moveCount=moveNum+1;
		if (dragging==0 || (dragging<3 && (displace & 31)==0 && dragControl))
		{
			if ((dragging==1 || dragging==2) && dragControl)
				releasePiece();
			downX=x;
			downY=y;
			j=x/32;
			i=y/32;
			if (inMap(j,i)>0)
			{
				if (j<3 && inMap(j+1,i)==0)
				{
					dragging=2;
					slideH=j;slideV=i;
				}
				else if (j>0 && inMap(j-1,i)==0)
				{
					dragging=2;
					downX-=32;
					slideH=j-1;slideV=i;
				}
				else if (i<3 && inMap(j,i+1)==0)
				{
					dragging=1;
					slideH=j;slideV=i;
				}
				else if (i>0 && inMap(j,i-1)==0)
				{
					dragging=1;
					downY-=32;
					slideH=j;slideV=i-1;
				}
				if (dragging>0)
				{
					vertical=(dragging==1);
					if (slideH==j && slideV==i)
					{
						displace=0;
						counter=0;
					}
					else
					{
						displace=32;
						counter=5;
					}
					slidePiece=inMap(j,i);
					map[7+j+6*i]=0;
					automatic=(!dragControl);
					if (automatic)
						slide.play();
				}
			}
			moveCount=1;
			moveNum=0;
		}
		else
		{
			if (dragging==5)
			{
				if (x>=(32*slideH) && x<(32+32*slideH) &&
					y>=(32*slideV+displace) && y<(32+32*slideV+displace))
				{
					downX=x;
					downY=y-displace;
					dragging=1;
				}
			}
			else if (dragging==6)
			{
				if (x>=(32*slideH+displace) && x<(32+32*slideH+displace) &&
					y>=(32*slideV) && y<(32+32*slideV))
				{
					downY=y;
					downX=x-displace;
					dragging=2;
				}
			}
		}
		return true;
	}

	public boolean mouseUp(java.awt.Event e,int x, int y)
	{
		if (dragging>0 && dragging<3 && dragControl)
			releasePiece();
		return true;
	}
	
	public void releasePiece()
	{
		if (displace<8)
		{
			displace=0;
			if (vertical)
			{
				drawVertical(slideH,slideV,0,slidePiece);
				map[7+slideH+6*slideV]=slidePiece;
				backG.drawImage(vert,slideH*32-3,slideV*32-3,this);
			}
			else
			{
				drawHorizontal(slideH,slideV,0,slidePiece);
				map[7+slideH+6*slideV]=slidePiece;
				backG.drawImage(hori,slideH*32-3,slideV*32-3,this);
			}
			dragging=0;
			click.play();
			repaint();
		}
		else if (displace>24)
		{
			displace=32;
			if (vertical)
			{
				drawVertical(slideH,slideV,32,slidePiece);
				map[7+slideH+6*slideV+6]=slidePiece;
				backG.drawImage(vert,slideH*32-3,slideV*32-3,this);
			}
			else
			{
				drawHorizontal(slideH,slideV,32,slidePiece);
				map[7+slideH+6*slideV+1]=slidePiece;
				backG.drawImage(hori,slideH*32-3,slideV*32-3,this);
			}
			dragging=0;
			click.play();
			repaint();
		}
		else
		{
			if (vertical)
				backG.drawImage(vert,slideH*32-3,slideV*32-3,this);
			else
				backG.drawImage(hori,slideH*32-3,slideV*32-3,this);
			dragging=(dragging&3)+4;
		}
	}
	
	public boolean mouseDrag(java.awt.Event e,int x, int y)
	{
		if (dragControl)
		switch(dragging)
		{
			case 1:
				displace=Math.min(32,Math.max(0,y-downY));
				drawVertical(slideH,slideV,displace,slidePiece);
				backG.drawImage(vert,slideH*32-3,slideV*32-3,this);
				repaint();
				break;
			case 2:
				displace=Math.min(32,Math.max(0,x-downX));
				drawHorizontal(slideH,slideV,displace,slidePiece);
				backG.drawImage(hori,slideH*32-3,slideV*32-3,this);
				repaint();
				break;
			default:
				break;
		}
		return true;	
	}

	public void getNextMove() // Called by the automatic solver, get move from queue.
	{
		int i,j;
		j=moves[moveNum];
		i=j/4;
		j=j&3;
		if (j<3 && inMap(j+1,i)==0)
		{
			dragging=2;
			slideH=j;slideV=i;
		}
		else if (j>0 && inMap(j-1,i)==0)
		{
			dragging=2;
			slideH=j-1;slideV=i;
		}
		else if (i<3 && inMap(j,i+1)==0)
		{
			dragging=1;
			slideH=j;slideV=i;
		}
		else if (i>0 && inMap(j,i-1)==0)
		{
			dragging=1;
			slideH=j;slideV=i-1;
		}
		vertical=(dragging==1);
		if (slideH==j && slideV==i)
		{
			displace=0;
			counter=0;
		}
		else
		{
			displace=32;
			counter=5;
		}
		slidePiece=inMap(j,i);
		map[7+j+6*i]=0;
		automatic=true;
		slide.play();
	}

	public void scramble() // Called from the outside
	{
		int i,j,k,l;
		if (!automatic)
		{
			for (i=0;i<4;i++)
				for (j=0;j<4;j++)
					map[7+i*6+j]=(i*4+j+1)&15;
			for (i=0;i<16;i++)
			{
				l=(randi()>>5)%15;
				j=7+6*(l/4)+(l&3);
				l=(randi()>>5)%15;
				k=7+6*(l/4)+(l&3);
				while (k==j)
				{
					l=(randi()>>5)%15;
					k=7+6*(l/4)+(l&3);
				}
				l=map[k];
				map[k]=map[j];
				map[j]=l;
			}
			buildBackground();
			repaint();
		}
	}
	
	public void solve() // Called from the outside. Compute solution and put in queue.
	{
		boolean detour;
		for (i=0;i<4;i++)
			for (j=0;j<4;j++)
				holder[i*4+j]=inMap(j,i);
		goalsDone=0;
		i=0;
		j=0;
		while (holder[subgoals[i]-1]==subgoals[i])
		{
			i++;
			if (subgoals[i]==0)
			{
				j=i;
				goalsDone++;
				i++;
			}
		}
		for (i=0;i<j;i++) // Lock the already finished ones
			if (subgoals[i]>0)
				holder[subgoals[i]-1]=-1;
		moveCount=0;
		if ((displace&31)>0) // Loose piece? Then ignore.
			goalsDone=9;
		while (goalsDone<9)
		{
			switch(goalsDone)
			{
				case 0:
					moveTo(1,0);
					break;
				case 1:
					moveTo(2,1);
					break;
				case 2:
					moveTo(3,3);
					holder[3]=-1;
					i=locate(0);
					detour=false;
					if (i==7)
					{
						if (holder[2]==4) // Darn!
						{
							makeDetour(detour3,7);
							detour=true;
						}
					}
					else if (i==2)
					{
						if (holder[6]==4) // Darn!
						{
							makeDetour(detour4,2);
							detour=true;
						}
					}
					else
					{
						if (holder[2]==4)
						{
							moveTo(4,6);
							makeDetour(detour4,2);
							detour=true;
						}
					}
					if (detour)
						makeDetour(detour1,7);
					else
						moveTo(4,7);
					holder[3]=3;
					holder[7]=-1;
					moveTo(3,2);
					holder[7]=4;
					moveTo(4,3);
					break;
				case 3:
					moveTo(5,4);
					break;
				case 4:
					moveTo(6,5);
					break;
				case 5:
					moveTo(7,7);
					holder[7]=-1;
					i=locate(0);
					detour=false;
					if (i==11)
					{
						if (holder[6]==8) // Darn!
						{
							makeDetour(detour5,11);
							detour=true;
						}
					}
					else if (i==6)
					{
						if (holder[10]==8) // Darn!
						{
							makeDetour(detour6,6);
							detour=true;
						}
					}
					else
					{
						if (holder[6]==8)
						{
							moveTo(8,10);
							makeDetour(detour6,6);
							detour=true;
						}
					}
					if (detour)
						makeDetour(detour2,11);
					else
						moveTo(8,11);
					holder[7]=7;
					holder[11]=-1;
					moveTo(7,6);
					holder[11]=8;
					moveTo(8,7);
					break;
				case 6:
					moveTo(13,8);
					holder[8]=-1;
					i=locate(0);
					detour=false;
					if (i==9)
					{
						if (holder[12]==9) // Darn!
						{
							makeDetour(detour7,9);
							detour=true;
						}
					}
					else if (i==12)
					{
						if (holder[13]==9) // Darn!
						{
							makeDetour(detour8,12);
							detour=true;
						}
					}
					else
					{
						if (holder[12]==9)
						{
							moveTo(9,13);
							makeDetour(detour8,12);
							detour=true;
						}
					}
					if (detour)
						makeDetour(detour9,9);
					else
						moveTo(9,9);
					holder[8]=13;
					holder[9]=-1;
					moveTo(13,12);
					holder[9]=9;
					moveTo(9,8);
					break;
				case 7:
					moveTo(14,9);
					i=locate(0);
					detour=false;
					if (i==10)
					{
						if (holder[13]==10) // Darn!
						{
							makeDetour(detour10,10);
							detour=true;
						}
					}
					else
					{
						if (holder[14]==10) // Darn!
						{
							makeDetour(detour11,13);
							detour=true;
						}
					}
					if (detour)
						makeDetour(detour12,10);
					else
						moveTo(10,10);
					holder[9]=14;
					holder[10]=-1;
					moveTo(14,13);
					holder[10]=10;
					moveTo(10,9);
					break;
				case 8:
					while (holder[15]!=0)
					{
						if (holder[10]==0)
						{
							moves[moveCount++]=11;
							holder[10]=holder[11];
							holder[11]=0;
						}
						if (holder[11]==0)
						{
							moves[moveCount++]=15;
							holder[11]=holder[15];
							holder[15]=0;
						}
						if (holder[14]==0)
						{
							moves[moveCount++]=15;
							holder[14]=holder[15];
							holder[15]=0;
						}
					}
					while (holder[14]!=15)
						makeDetour(roundabout,15);
					break;
				default:
					break;
			}
			goalsDone++;
		}
		if (moveCount>0)
		{
			moveNum=0;
			getNextMove();
			oldDragControl=dragControl;
			dragControl=false;
		}
	}

	public void makeDetour(int dList[],int hole)
	{
		int i,j;
		i=0;
		j=hole;
		while (dList[i]>=0)
		{
			holder[j]=holder[dList[i]];
			holder[dList[i]]=0;
			j=dList[i];
			moves[moveCount++]=dList[i++];
		}
	}

	public void moveTo(int p, int t) // Move piece p to target position t
	{
		int whereNow,i,j;
		i=locate(p);
		whereNow=i;
		j=0;
		while ((i&3)!=(t&3))
		{
			if ((i&3)<(t&3))
				i++;
			else
				i--;
			ppath[j++]=i;
		}
		while (i>t)
		{
			i-=4;
			ppath[j++]=i;
		}
		holder[whereNow]=-1;
		for (i=0;i<j;i++)
		{
			moveHole(ppath[i],whereNow);
			moves[moveCount++]=whereNow;
			holder[whereNow]=0;
			holder[ppath[i]]=-1;
			whereNow=ppath[i];
		}
	}
	
	public void moveHole(int tg, int ppos) // Move hole to target position
	{
		int i,j,k,l,posCount=0,negCount=0;
		i=locate(0);
		// First phase: reach neighborhood of target piece
		while (Math.abs((i&3)-(ppos&3))>1 || Math.abs((i/4)-(ppos/4))>1)
		{
			if ((i&3)<(tg&3) && holder[i+1]>0)
				k=i+1;
			else if ((i&3)>(tg&3) && holder[i-1]>0)
				k=i-1;
			else if ((i/4)<(tg/4) && holder[i+4]>0)
				k=i+4;
			else
				k=i-4;
			moves[moveCount++]=k;
			holder[i]=holder[k];
			holder[k]=0;
			i=k;
		}
		// Second phase: take shortest path clockwise or counter-clockwise
		if (i!=tg)
		{
			j=8;
			while (i!=ppos+roundDisp[j])
				j++;
			k=j;
			while (ppos+roundDisp[k]!=tg)
			{
				k++;
				if (ppos+roundDisp[k]>=0 &&
					ppos+roundDisp[k]<16 && (ppos&3)+rounddx[k]<4 &&
					(ppos&3)+rounddx[k]>=0 && holder[ppos+roundDisp[k]]>0)
					posCount++;
				else
					posCount+=50;
			}
			k=j;
			while (ppos+roundDisp[k]!=tg)
			{
				k--;
				if (ppos+roundDisp[k]>=0 &&
					ppos+roundDisp[k]<16 && (ppos&3)+rounddx[k]<4 &&
					(ppos&3)+rounddx[k]>=0 && holder[ppos+roundDisp[k]]>0)
					negCount++;
				else
					negCount+=50;
			}
			if (posCount<=negCount)
				l=1;
			else
				l=-1;
			while (i!=tg)
			{
				j+=l;
				k=ppos+roundDisp[j];
				moves[moveCount++]=k;
				holder[i]=holder[k];
				holder[k]=0;
				i=k;
			}
		}
	}
	
	public int locate(int num)
	{
		li=0;
		while (holder[li]!=num)
			li++;
		return li;
	}

	public void toggle() // Called from the outside
	{
		dragControl=!dragControl;
		oldDragControl=dragControl;
	}

	public void run()
	{
		while (life!=null)
		{
			try
			{
				life.sleep(Math.max(25,nextTime-System.currentTimeMillis()));
			} catch (InterruptedException e) {}
			nextTime=System.currentTimeMillis()+75;
			if (automatic)
			{
				counter++;
				displace=autoDisplace[counter];
				if (dragging==1)
				{
					drawVertical(slideH,slideV,displace,slidePiece);
					backG.drawImage(vert,slideH*32-3,slideV*32-3,this);
				}
				else if (dragging==2)
				{
					drawHorizontal(slideH,slideV,displace,slidePiece);
					backG.drawImage(hori,slideH*32-3,slideV*32-3,this);
				}
				if ((displace&31)==0)
				{
					if (vertical)
					{
						if (displace==0)
							map[7+slideH+6*slideV]=slidePiece;
						else
							map[7+slideH+6*slideV+6]=slidePiece;
					}
					else
					{
						if (displace==0)
							map[7+slideH+6*slideV]=slidePiece;
						else
							map[7+slideH+6*slideV+1]=slidePiece;
					}
					moveNum++;
					dragging=0;
					repaint();
					if (moveNum==moveCount)
					{
						automatic=false;
						dragControl=oldDragControl;
					}
					else
						getNextMove();
				}
				else
					repaint();
			}
		}
	}

	public void start()
	{
		if (life==null)
		{
			life=new Thread(this);
			life.start();
			nextTime=System.currentTimeMillis()+80;
		}
	}
 
	public void stop()
	{
		if ((life!=null)&&(life.isAlive()))
		{
			life.stop();
		}
		life=null;
	}

	public int randi()
	{
		seed=(seed*171)%30269;
		return seed;
	}

	public boolean keyDown(java.awt.Event e,int key) // Alternative keyboard control
	{
		switch(key)
		{
			case 's':
				solve();
				break;
			case 't':
				toggle();
				break;
			case 'x':
				scramble();
				break;
			default:
				break;
		}
		return true;
	}

	public void update(Graphics g)
	{
		g.drawImage(background,0,0,this);
	}
	
	public void paint(Graphics g)
	{
		g.drawImage(background,0,0,this);
	}
}
