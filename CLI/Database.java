import java.util.*;
import java.sql.*;

public class Database{
    Connection connect;
    Statement statement;

    public Database(String dbName,String pwd)
    {
        String db = "jdbc:mysql://localhost:3306/"+dbName;
        try{        	
            connect = DriverManager.getConnection(db,"root",pwd);
            statement = connect.createStatement();
        } catch(Exception e)
        {
            System.out.println("Cannot connect to database!!!");
            System.exit(1);
        }
    }

    public int verify(String user,String pwd)
    {
        String cmd = "SELECT type FROM userauth WHERE userid = ? AND password = ?";
        try{
            PreparedStatement auth = connect.prepareStatement(cmd);
            auth.setString(1,user);
            auth.setString(2,pwd);
            ResultSet output = auth.executeQuery();

            while(output.next())
            {
                String type = output.getString("type");
                if(type.equals("manager")) return 1;
                else return 2;
            }
        }catch(Exception e){ e.printStackTrace();}
        
        return 0;
    }

    public int addRecord(String table, HashMap<String,String> input)
    {
        int cnt = 0;
        String param1 = "";
        String param2 = "";
        for(String key : input.keySet())
        {
            if(cnt>0){
                param1 += ",";
                param2 += ",";
            }
            param1 += key;
            param2 += "?";
            ++cnt;
        }

        String txt = String.format("INSERT into %s values(%s)",table+"(%s)","%s");
        String cmd = String.format(txt,param1,param2);

        int res = 0;
        try{
            PreparedStatement addStmt = connect.prepareStatement(cmd);
            int i = 1;
            for(String k : input.keySet())
            {
                addStmt.setString(i++,input.get(k)); // What if attr is int?
            }
            
            res = addStmt.executeUpdate();
            addStmt.close();
        }catch(Exception e) {
            e.printStackTrace();
            return 0;
        }
        return res;
    }

    public int delProperty(String property_id)
    {
        // database.delRecord("Property",property_id);
        int res;
        try{
            PreparedStatement delStmt = connect.prepareStatement("DELETE from Property where property_id = ?");
            delStmt.setString(1,property_id);
            res = delStmt.executeUpdate();
            delStmt.close();
        }
        catch(Exception e) {
            e.printStackTrace();
            return -1;
        }
        return res;
    }

    public int viewRecordById(String table,String id)
    {
        String cmd = String.format("SELECT * from %s where %s = ?",table,table+"_id");
        try{
            PreparedStatement viewStmt = connect.prepareStatement(cmd);
            viewStmt.setString(1,id);
            ResultSet record = viewStmt.executeQuery();
            ResultSetMetaData meta = record.getMetaData();
            int totCol = meta.getColumnCount();
            while(record.next())
            {
                for(int i=1;i<=totCol;++i)
                {
                    String colName = meta.getColumnLabel(i);
                    String val = record.getString(colName);
                    if(!record.wasNull())
                    {
                        System.out.println(colName + " : " + val);
                    }
                }
            }
        }
        catch(Exception e) {
            e.printStackTrace();
            return -1;
        }
        return 1;
    }

    public int viewSalesReport(String agent_id,String start,String end)
    {
        String s1 = "SELECT Transaction_id,property_id,buyer_id,seller_id,final_price,date_of_sale from transaction ";
        String s2 = "where agent_id = ? and category='sale' and date_of_sale between ? and ?";
        String cmd = s1+s2;
        int res = 0;
        try{
            PreparedStatement viewStmt = connect.prepareStatement(cmd);
            viewStmt.setString(1,agent_id);
            viewStmt.setString(2,start);
            viewStmt.setString(3,end);
            ResultSet record = viewStmt.executeQuery();
            ResultSetMetaData meta = record.getMetaData();
            int totCol = meta.getColumnCount();
            while(record.next())
            {
                if(res==0)  // Print columns
                {
                    System.out.print("S.No      ");
                    for(int i=1;i<=totCol;++i)
                    {
                        String colName = meta.getColumnLabel(i);
                        System.out.print(colName+"         ");
                    }
                    System.out.println();
                }
                // print row
                ++res;
                System.out.print(res+"     ");
                for(int i=1;i<=totCol;++i)
                {
                    String val = record.getString(i);
                    System.out.print(val+"         ");
                }
                System.out.println();                
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return -1;
        }
        return res;
    }

    public int viewRentInfo(String start,String end)
    {
        int res=0;
        try{
            ResultSet record = statement.executeQuery("SELECT agent_id from Agent");
            while(record.next())
            {
                String agent_id = record.getString(1);
                viewRentInfoAgent(agent_id,start,end,res+1);
                res++;
            }
        }
        catch(Exception e){
            e.printStackTrace(); // for testing purpose
            return -1;
        }
        System.out.println();
        return res;
    }

    public void viewRentInfoAgent(String agent_id,String start,String end,int sno) throws SQLException
    {
        String s1 = "SELECT property_id,street_name,final_price from Property NATURAL JOIN Transaction";
        String s2 = "WHERE agent_id = ? AND category='rent' AND date_of_sale between ? and ?";
        String cmd = String.format(s1+s2,agent_id,start,end);

        PreparedStatement viewTx = connect.prepareStatement(cmd);
        viewTx.setString(1,agent_id);
        viewTx.setString(2,start);
        viewTx.setString(3,end);
        ResultSet record = viewTx.executeQuery();

        int totProperty = 0;
        long totAmt = 0;
        Set<String> loc = new TreeSet<String>();

        while(record.next())
        {
            totProperty++;
            totAmt += Long.parseLong(record.getString("final_price"));
            loc.add(record.getString("street_name"));
        }
        System.out.print(sno+"  ");
        System.out.print(agent_id+"  ");
        System.out.print(totProperty+"  ");
        System.out.print(totAmt+"  ");
        System.out.println(loc);
    }

    public void close() throws SQLException
    {
        statement.close();
        connect.close();
    }
}