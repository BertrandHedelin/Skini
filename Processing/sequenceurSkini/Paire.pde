public class Paire {

    private final String first;
    private final int second;

    public Paire(String first, int second) {
        this.first = first;
        this.second = second;
    }

    public String pseudo() { 
      return first; 
    };
    public int idClient() { 
      return second; 
    };
}
